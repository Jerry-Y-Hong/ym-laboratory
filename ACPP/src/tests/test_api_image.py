"""
Image Agent API Integration Tests
==================================
Tests for /api/v1/image/generate and /api/v1/image/status/{job_id}.
"""

from fastapi.testclient import TestClient


def test_image_generate_endpoint(client: TestClient):
    payload = {
        "content_asset_id": "KA-KIMCHI-20260723-500",
        "q_code": "Q-KIM-FERM-500",
        "image_type": "hero_banner",
        "style": "PHOTOREALISTIC",
        "aspect_ratio": "16:9",
        "language": "EN",
    }

    response = client.post("/api/v1/image/generate", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "job_id" in data
    assert data["job_id"].startswith("WF-IMG-")
    assert data["image_asset_id"].startswith("IMG-")
    assert data["generation_status"] == "COMPLETED"
    assert data["image_metadata"]["engine"] == "DALL-E 3"
    assert data["image_metadata"]["q_code"] == "Q-KIM-FERM-500"
    assert len(data["media_manifest"]["images"]) == 1
    assert len(data["media_manifest"]["thumbnails"]) == 1


def test_get_image_job_status_endpoint(client: TestClient):
    # 1. Trigger image generation
    req_payload = {
        "content_asset_id": "KA-KIMCHI-20260723-600",
        "q_code": "Q-KIM-FERM-600",
        "image_type": "blog_thumbnail",
    }
    gen_res = client.post("/api/v1/image/generate", json=req_payload)
    assert gen_res.status_code == 201
    job_id = gen_res.json()["job_id"]

    # 2. Query job status
    status_res = client.get(f"/api/v1/image/status/{job_id}")
    assert status_res.status_code == 200

    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert status_data["agent_id"] == "ACPP-AG-05"
    assert status_data["status"] == "COMPLETED"
    assert "metrics" in status_data
    assert status_data["metrics"]["engine"] == "DALL-E 3"


def test_get_image_job_status_not_found(client: TestClient):
    response = client.get("/api/v1/image/status/WF-IMG-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"].lower()
