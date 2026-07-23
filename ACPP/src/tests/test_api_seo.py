"""
SEO Agent API Integration Tests
================================
Tests for /api/v1/seo/optimize and /api/v1/seo/status/{job_id}.
"""

from fastapi.testclient import TestClient


def test_seo_optimize_endpoint(client: TestClient):
    payload = {
        "content_asset_id": "KA-KIMCHI-20260723-100",
        "q_code": "Q-KIM-FERM-100",
        "target_keywords": ["kimchi", "probiotics", "fermentation"],
        "target_audience": "GENERAL_PUBLIC",
        "language": "EN",
        "search_intent": "INFORMATIONAL",
        "raw_text": "Lactobacillus plantarum is essential for kimchi fermentation kinetics.",
    }

    response = client.post("/api/v1/seo/optimize", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-SEO-")
    assert data["optimized_asset_id"].startswith("SEO-")
    assert data["seo_score"] > 0.0
    assert data["readability_score"] >= 0.0
    assert data["metadata"]["canonical_url"] == "https://acpp.ym-lab.io/content/KA-KIMCHI-20260723-100"
    assert data["metadata"]["json_ld"]["identifier"] == "Q-KIM-FERM-100"


def test_get_seo_job_status_endpoint(client: TestClient):
    # 1. Trigger SEO optimization
    req_payload = {
        "content_asset_id": "KA-KIMCHI-20260723-200",
        "q_code": "Q-KIM-FERM-200",
        "target_keywords": ["kimchi"],
    }
    opt_res = client.post("/api/v1/seo/optimize", json=req_payload)
    assert opt_res.status_code == 201
    job_id = opt_res.json()["job_id"]

    # 2. Query job status
    status_res = client.get(f"/api/v1/seo/status/{job_id}")
    assert status_res.status_code == 200

    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert status_data["agent_id"] == "ACPP-AG-04"
    assert status_data["status"] == "COMPLETED"
    assert "metrics" in status_data
    assert "seo_score" in status_data["metrics"]


def test_get_seo_job_status_not_found(client: TestClient):
    response = client.get("/api/v1/seo/status/WF-SEO-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"].lower()
