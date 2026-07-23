"""
Analytics Agent (ACPP-AG-07) Core Module
=========================================
Ingests post-publication telemetry, calculates Content Effectiveness Index (CEI),
grades performance, and generates feedback signals for the Knowledge Repository under ADF v3.1.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from acpp.analytics.mock_analytics_adapter import MockAnalyticsAdapter
from acpp.schemas.analytics import (
    AnalyticsResponse,
    CEIReport,
    FeedbackSignal,
    TelemetryIngestRequest,
)

logger = logging.getLogger("acpp.agents.analytics")


class AnalyticsAgent:
    """
    Analytics Agent (ACPP-AG-07)
    Ingests channel metrics, computes CEI composite scores, and drives feedback loops.
    """

    AGENT_ID = "ACPP-AG-07"
    AGENT_NAME = "Analytics Agent"
    VERSION = "v1.0.0"

    def __init__(self) -> None:
        self.adapter = MockAnalyticsAdapter()
        self.logger = logger

    def ingest_telemetry(self, request: TelemetryIngestRequest) -> Dict[str, Any]:
        """Ingest and normalize raw telemetry metrics."""
        raw_data = request.model_dump(mode="json")
        normalized = self.adapter.normalize_metrics(raw_data)
        self.logger.info(
            f"[{self.AGENT_ID}] Ingested telemetry for asset '{request.content_asset_id}': "
            f"views={normalized['views']} clicks={normalized['clicks']}"
        )
        return normalized

    def calculate_cei(self, telemetry_data: Dict[str, Any]) -> CEIReport:
        """
        Calculate Content Effectiveness Index (CEI) using normalized formula:
        CEI = (Reach Score + Engagement Score + Conversion Score + Quality Score) / 4
        """
        views = telemetry_data.get("views", 0)
        eng_rate = telemetry_data.get("engagement_rate", 0.0)
        conv_rate = telemetry_data.get("conversion_rate", 0.0)
        retention = telemetry_data.get("retention_rate", 0.70)

        # 1. Reach Score (0 - 100): 1000 views = 100 score benchmark
        reach_score = min(max((views / 10.0), 0.0), 100.0)

        # 2. Engagement Score (0 - 100): 20% engagement rate = 100 score benchmark
        engagement_score = min(max((eng_rate * 500.0), 0.0), 100.0)

        # 3. Conversion Score (0 - 100): 10% conversion rate = 100 score benchmark
        conversion_score = min(max((conv_rate * 1000.0), 0.0), 100.0)

        # 4. Quality & Retention Score (0 - 100)
        quality_score = min(max((retention * 100.0), 0.0), 100.0)

        total_cei = round(
            (reach_score + engagement_score + conversion_score + quality_score) / 4.0, 2
        )

        return CEIReport(
            reach_score=round(reach_score, 2),
            engagement_score=round(engagement_score, 2),
            conversion_score=round(conversion_score, 2),
            quality_score=round(quality_score, 2),
            total_cei=total_cei,
        )

    def analyze_content_performance(self, cei_score: float) -> str:
        """Assign performance grade based on CEI score brackets."""
        if cei_score >= 90.0:
            return "Excellent"
        elif cei_score >= 70.0:
            return "Good"
        elif cei_score >= 50.0:
            return "Average"
        else:
            return "Needs Improvement"

    def generate_feedback_signal(
        self, target_asset: str, cei_report: CEIReport
    ) -> FeedbackSignal:
        """
        Generate feedback signal for Knowledge Repository Index updates.
        """
        score = cei_report.total_cei

        if score < 50.0:
            rec_type = "TITLE_OPTIMIZATION"
            action = "Recommend title improvement and SEO keyword re-balancing to improve click-through rate."
            confidence = 0.95
        elif score >= 85.0:
            rec_type = "PRIORITY_BOOST"
            action = "High performance verified. Increase priority for generating related multi-channel content for this Q-Code topic."
            confidence = 0.98
        elif score < 70.0:
            rec_type = "CONTENT_UPDATE"
            action = "Average performance detected. Recommend updating content body with fresh claims or additional visual media."
            confidence = 0.88
        else:
            rec_type = "MAINTAIN"
            action = "Content performance is optimal. Maintain current repository indexing status."
            confidence = 0.90

        self.logger.info(
            f"[{self.AGENT_ID}] Generated feedback signal '{rec_type}' for asset '{target_asset}' (CEI: {score})"
        )

        return FeedbackSignal(
            recommendation_type=rec_type,
            target_asset=target_asset,
            suggested_action=action,
            confidence_score=confidence,
        )

    def create_analytics_report(self, request: TelemetryIngestRequest) -> AnalyticsResponse:
        """
        Main pipeline entrypoint: Ingest telemetry, calculate CEI, grade performance,
        and generate repository feedback signal.
        """
        self.logger.info(
            f"[{self.AGENT_ID}] Processing analytics report for asset '{request.content_asset_id}'"
        )

        norm_telemetry = self.ingest_telemetry(request)
        cei_report = self.calculate_cei(norm_telemetry)
        grade = self.analyze_content_performance(cei_report.total_cei)
        feedback_signal = self.generate_feedback_signal(request.content_asset_id, cei_report)

        now_utc = datetime.now(timezone.utc)
        timestamp_str = now_utc.strftime("%Y%m%d%H%M%S")
        job_id = f"WF-ANALYTICS-{timestamp_str}"

        return AnalyticsResponse(
            job_id=job_id,
            content_asset_id=request.content_asset_id,
            cei_score=cei_report.total_cei,
            performance_grade=grade,
            feedback_status="GENERATED",
            cei_report=cei_report,
            feedback_signal=feedback_signal,
            created_at=now_utc,
        )
