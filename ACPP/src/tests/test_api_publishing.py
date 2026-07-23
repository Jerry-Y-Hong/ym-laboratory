"""
Publishing Agent API Integration Tests
======================================
Tests for /api/v1/publishing/publish and /api/v1/publishing/status/{job_id}.
Verifies HTTP 403 Forbidden enforcement on invalid Human Approval Tokens.
"""

from fastapi.testclient import TestClient


def test_publishing_without_valid_token_rejected(client: TestClient):
    payload = {
        "content_asset_id": "KA-KIMCHI-20260723-700",
        "target_channel": "cms",
        "approval_token": "INVALID-NO-APPROVAL-TOKEN",
    }

    response = client.post("/api/v1/publishing/publish", json=payload)
    assert response.status_code == 403

    error_data = response.json()
    assert error_data["error"]["code"] == "ACPP-ERR-4030"
    assert "Human Approval Token required" in error_data["error"]["message"]


def test_publishing_with_valid_token_success(client: TestClient):
    payload = {
        "content_asset_id": "KA-KIMCHI-20260723-800",
        "target_channel": "cms",
        "approval_token": "HA-TOKEN-2026-OK",
    }

    response = client.post("/api/v1/publishing/publish", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-PUB-")
    assert data["publish_status"] == "PUBLISHED"
    assert data["channel"] == "cms"
    assert "https://blog.ym-lab.io/" in data["published_url"]
    assert data["approval_status"] == "APPROVED"
    assert data["dispatch_id"].startswith("DISPATCH-CMS-")


def test_get_publishing_job_status_endpoint(client: TestClient):
    # 1. Dispatch publishing with valid token
    req_payload = {
        "content_asset_id": "KA-KIMCHI-20260723-850",
        "target_channel": "twitter",
        "approval_token": "HA-TOKEN-2026-OK",
    }
    pub_res = client.post("/api/v1/publishing/publish", json=req_payload)
    assert pub_res.status_code == 201
    job_id = pub_res.json()["job_id"]

    # 2. Query job status
    status_res = client.get(f"/api/v1/publishing/status/{job_id}")
    assert status_res.status_code == 200

    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert status_data["agent_id"] == "ACPP-AG-06"
    assert status_data["status"] == "COMPLETED"
    assert "metrics" in status_data
    assert status_data["metrics"]["channel"] == "twitter"


def test_get_publishing_job_status_not_found(client: TestClient):
    response = client.get("/api/v1/publishing/status/WF-PUB-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"].lower()
