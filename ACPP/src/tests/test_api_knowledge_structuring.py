"""
Knowledge Structuring API Integration Tests
============================================
Tests for POST /api/v1/knowledge/structure endpoint.
"""

from fastapi.testclient import TestClient


def test_structure_knowledge_endpoint(client: TestClient):
    payload = {
        "raw_asset_id": "RAW-KIMCHI-TEST-001",
        "domain_code": "KIMCHI",
        "qcode_prefix": "Q-KIM-FERM",
        "title": "Empirical Kimchi Fermentation Dynamics",
    }

    response = client.post("/api/v1/knowledge/structure", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert data["asset_id"].startswith("KA-KIMCHI-")
    assert data["qcode"] == "Q-KIM-FERM-001"
    assert data["domain_code"] == "KIMCHI"
    assert data["title"] == "Empirical Kimchi Fermentation Dynamics"
    assert "repository/structured/" in data["file_path_md"]
    assert "repository/structured/" in data["file_path_json"]
    assert data["claims_count"] >= 1
    assert data["vector_dim"] == 1536


def test_structure_knowledge_and_query_asset(client: TestClient):
    # 1. Post structuring request
    struct_payload = {
        "raw_asset_id": "RAW-KIMCHI-TEST-002",
        "domain_code": "KIMCHI",
        "qcode_prefix": "Q-KIM-BAC",
    }
    struct_res = client.post("/api/v1/knowledge/structure", json=struct_payload)
    assert struct_res.status_code == 201

    asset_id = struct_res.json()["asset_id"]
    qcode = struct_res.json()["qcode"]

    # 2. Query KnowledgeAsset by asset_id
    get_res = client.get(f"/api/v1/knowledge/{asset_id}")
    assert get_res.status_code == 200
    assert get_res.json()["asset_id"] == asset_id
    assert get_res.json()["qcode"] == qcode
