"""
Writing Agent API Integration Tests
====================================
Tests for /api/v1/writing/generate and /api/v1/writing/status/{job_id}.
"""

from fastapi.testclient import TestClient


def test_writing_generate_endpoint(client: TestClient):
    payload = {
        "knowledge_asset_id": "KA-KIMCHI-20260723-999",
        "q_code": "Q-KIM-FERM-999",
        "content_type": "all",
        "target_audience": "GENERAL_PUBLIC",
        "language": "EN",
        "tone": "PROFESSIONAL",
    }

    response = client.post("/api/v1/writing/generate", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-WRITE-")
    assert data["source_asset_id"] == "KA-KIMCHI-20260723-999"
    assert data["q_code"] == "Q-KIM-FERM-999"
    assert data["generation_status"] == "COMPLETED"
    assert len(data["generated_assets"]) == 5


def test_get_writing_job_status_endpoint(client: TestClient):
    # 1. Trigger content generation
    req_payload = {
        "knowledge_asset_id": "KA-KIMCHI-20260723-888",
        "q_code": "Q-KIM-FERM-888",
        "content_type": "blog",
    }
    gen_res = client.post("/api/v1/writing/generate", json=req_payload)
    assert gen_res.status_code == 201
    job_id = gen_res.json()["job_id"]

    # 2. Query job status
    status_res = client.get(f"/api/v1/writing/status/{job_id}")
    assert status_res.status_code == 200

    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert status_data["agent_id"] == "ACPP-AG-03"
    assert status_data["status"] == "COMPLETED"
    assert "metrics" in status_data
    assert status_data["metrics"]["q_code"] == "Q-KIM-FERM-888"


def test_get_writing_job_status_not_found(client: TestClient):
    response = client.get("/api/v1/writing/status/WF-WRITE-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"].lower()
