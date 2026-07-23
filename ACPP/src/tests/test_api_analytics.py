"""
Analytics Agent API Integration Tests
=====================================
Tests for /api/v1/analytics/telemetry and /api/v1/analytics/report/{content_asset_id}.
"""

from fastapi.testclient import TestClient


def test_analytics_telemetry_endpoint(client: TestClient):
    payload = {
        "content_asset_id": "KA-KIMCHI-20260723-900",
        "publishing_id": "DISPATCH-CMS-900",
        "channel": "cms",
        "views": 1500,
        "clicks": 200,
        "engagement_rate": 0.18,
        "conversion_rate": 0.07,
        "shares": 40,
        "retention_rate": 0.85,
    }

    response = client.post("/api/v1/analytics/telemetry", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-ANALYTICS-")
    assert data["content_asset_id"] == "KA-KIMCHI-20260723-900"
    assert data["cei_score"] > 80.0
    assert data["performance_grade"] in ("Good", "Excellent")
    assert "feedback_signal" in data
    assert data["feedback_signal"]["target_asset"] == "KA-KIMCHI-20260723-900"


def test_get_analytics_report_endpoint(client: TestClient):
    # 1. Ingest telemetry
    req_payload = {
        "content_asset_id": "KA-KIMCHI-20260723-950",
        "views": 1100,
        "clicks": 160,
        "engagement_rate": 0.16,
        "conversion_rate": 0.05,
    }
    ingest_res = client.post("/api/v1/analytics/telemetry", json=req_payload)
    assert ingest_res.status_code == 201

    # 2. Query report endpoint
    report_res = client.get("/api/v1/analytics/report/KA-KIMCHI-20260723-950")
    assert report_res.status_code == 200

    report_data = report_res.json()
    assert report_data["content_asset_id"] == "KA-KIMCHI-20260723-950"
    assert "cei_score" in report_data
    assert "cei_report" in report_data
    assert "feedback_signal" in report_data
