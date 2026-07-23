"""
Analytics Agent Unit Tests
==========================
Tests for AnalyticsAgent (ACPP-AG-07) telemetry ingestion, CEI calculation,
performance grade mapping, feedback signal generation, and mock gateway adapter.
"""

from acpp.agents.analytics_agent import AnalyticsAgent
from acpp.analytics.mock_analytics_adapter import MockAnalyticsAdapter
from acpp.schemas.analytics import TelemetryIngestRequest


def test_mock_analytics_adapter():
    adapter = MockAnalyticsAdapter()

    raw = adapter.collect_metrics("KA-KIMCHI-001", "cms")
    assert raw["content_asset_id"] == "KA-KIMCHI-001"
    assert raw["raw_views"] == 1250

    norm = adapter.normalize_metrics(raw)
    assert norm["views"] == 1250
    assert norm["clicks"] == 180
    assert adapter.validate_metrics(norm)


def test_cei_calculation():
    agent = AnalyticsAgent()
    telemetry = {
        "views": 1000,
        "engagement_rate": 0.20,
        "conversion_rate": 0.10,
        "retention_rate": 0.80,
    }

    report = agent.calculate_cei(telemetry)

    assert report.reach_score == 100.0
    assert report.engagement_score == 100.0
    assert report.conversion_score == 100.0
    assert report.quality_score == 80.0
    assert report.total_cei == 95.0


def test_performance_grade_mapping():
    agent = AnalyticsAgent()

    assert agent.analyze_content_performance(95.0) == "Excellent"
    assert agent.analyze_content_performance(80.0) == "Good"
    assert agent.analyze_content_performance(60.0) == "Average"
    assert agent.analyze_content_performance(40.0) == "Needs Improvement"


def test_feedback_signal_generation():
    agent = AnalyticsAgent()

    # High performance -> PRIORITY_BOOST
    telemetry_high = {"views": 1200, "engagement_rate": 0.20, "conversion_rate": 0.10, "retention_rate": 0.85}
    report_high = agent.calculate_cei(telemetry_high)
    sig_high = agent.generate_feedback_signal("KA-KIMCHI-001", report_high)
    assert sig_high.recommendation_type == "PRIORITY_BOOST"

    # Low performance -> TITLE_OPTIMIZATION
    telemetry_low = {"views": 100, "engagement_rate": 0.02, "conversion_rate": 0.01, "retention_rate": 0.30}
    report_low = agent.calculate_cei(telemetry_low)
    sig_low = agent.generate_feedback_signal("KA-KIMCHI-002", report_low)
    assert sig_low.recommendation_type == "TITLE_OPTIMIZATION"


def test_create_analytics_report_full():
    agent = AnalyticsAgent()
    req = TelemetryIngestRequest(
        content_asset_id="KA-KIMCHI-20260723-001",
        publishing_id="DISPATCH-CMS-001",
        channel="cms",
        views=1500,
        clicks=200,
        engagement_rate=0.18,
        conversion_rate=0.08,
        retention_rate=0.82,
    )

    res = agent.create_analytics_report(req)

    assert res.job_id.startswith("WF-ANALYTICS-")
    assert res.content_asset_id == "KA-KIMCHI-20260723-001"
    assert res.cei_score > 80.0
    assert res.performance_grade in ("Good", "Excellent")
    assert res.feedback_signal.target_asset == "KA-KIMCHI-20260723-001"
