"""
Analytics Agent Schemas
========================
Pydantic validation schemas for Analytics Agent (ACPP-AG-07) endpoints,
Content Effectiveness Index (CEI) reports, and feedback signals.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class TelemetryIngestRequest(BaseModel):
    content_asset_id: str = Field(..., description="Target Content Asset or Knowledge Asset ID", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    publishing_id: Optional[str] = Field(None, description="Dispatched publication receipt ID", json_schema_extra={"example": "DISPATCH-CMS-001"})
    channel: str = Field("cms", description="Publishing channel name")
    views: int = Field(1000, ge=0, description="Total views count")
    clicks: int = Field(150, ge=0, description="Total clicks count")
    engagement_rate: float = Field(0.15, ge=0.0, le=1.0, description="Engagement rate (0.0 - 1.0)")
    conversion_rate: float = Field(0.05, ge=0.0, le=1.0, description="Conversion rate (0.0 - 1.0)")
    shares: int = Field(25, ge=0, description="Social shares count")
    retention_rate: float = Field(0.75, ge=0.0, le=1.0, description="Reader retention rate")
    collected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CEIReport(BaseModel):
    reach_score: float = Field(..., ge=0.0, le=100.0, description="Reach score (0-100)")
    engagement_score: float = Field(..., ge=0.0, le=100.0, description="Engagement score (0-100)")
    conversion_score: float = Field(..., ge=0.0, le=100.0, description="Conversion score (0-100)")
    quality_score: float = Field(..., ge=0.0, le=100.0, description="Quality & retention score (0-100)")
    total_cei: float = Field(..., ge=0.0, le=100.0, description="Overall Content Effectiveness Index (CEI)")


class FeedbackSignal(BaseModel):
    recommendation_type: str = Field(..., description="Recommendation type (TITLE_OPTIMIZATION, PRIORITY_BOOST, CONTENT_UPDATE, MAINTAIN)")
    target_asset: str = Field(..., description="Target asset ID")
    suggested_action: str = Field(..., description="Suggested repository feedback action")
    confidence_score: float = Field(0.9, ge=0.0, le=1.0, description="Recommendation confidence score")


class AnalyticsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow execution run ID", json_schema_extra={"example": "WF-ANALYTICS-20260723-001"})
    content_asset_id: str = Field(..., description="Target content asset ID")
    cei_score: float = Field(..., ge=0.0, le=100.0, description="CEI score (0-100)")
    performance_grade: str = Field(..., description="Grade (Excellent, Good, Average, Needs Improvement)")
    feedback_status: str = Field("GENERATED", description="Feedback status")
    cei_report: CEIReport = Field(..., description="Detailed CEI report metrics")
    feedback_signal: FeedbackSignal = Field(..., description="Feedback loop recommendation")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
