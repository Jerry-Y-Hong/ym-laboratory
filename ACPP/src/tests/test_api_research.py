"""
Research Agent API Integration Tests
====================================
Tests for /api/v1/research/ingest and /api/v1/research/status/{job_id}.
"""

from fastapi.testclient import TestClient


def test_research_ingest_endpoint(client: TestClient):
    payload = {
        "query": "Fermentation Temperature Optimization",
        "domain_code": "KIMCHI",
        "depth": 2,
        "max_sources": 4,
        "simulated": True,
    }

    response = client.post("/api/v1/research/ingest", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-RES-")
    assert data["status"] == "COMPLETED"
    assert data["raw_asset_id"].startswith("RAW-KIMCHI-")
    assert "repository/raw/" in data["payload_path"]
    assert len(data["sha256_provenance_hash"]) == 64
    assert data["items_count"] == 4
    assert data["credibility_avg"] > 0.0


def test_get_research_job_status_endpoint(client: TestClient):
    # 1. First trigger ingestion
    ingest_payload = {
        "query": "Lactobacillus plantarum in Kimchi",
        "domain_code": "KIMCHI",
        "max_sources": 2,
        "simulated": True,
    }
    ingest_res = client.post("/api/v1/research/ingest", json=ingest_payload)
    assert ingest_res.status_code == 201
    job_id = ingest_res.json()["job_id"]

    # 2. Query status endpoint
    status_res = client.get(f"/api/v1/research/status/{job_id}")
    assert status_res.status_code == 200

    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert status_data["agent_id"] == "ACPP-AG-01"
    assert status_data["status"] == "COMPLETED"
    assert "metrics" in status_data
    assert status_data["metrics"]["items_count"] == 2


def test_get_research_job_status_not_found(client: TestClient):
    response = client.get("/api/v1/research/status/WF-RES-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"].lower()
