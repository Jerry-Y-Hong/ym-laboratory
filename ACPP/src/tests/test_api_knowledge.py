"""
Knowledge Asset API Tests
==========================
Tests for Knowledge Asset REST endpoints.
"""


def test_create_and_get_knowledge_asset(client):
    payload = {
        "asset_id": "KA-KIMCHI-2026-001",
        "qcode": "Q-KIM-FERM-001",
        "domain_code": "KIMCHI",
        "title": "Kimchi Fermentation Biology",
        "version": "v1.0.0",
        "author_agent_id": "ACPP-AG-02",
        "verification_score": 0.96,
        "security_level": "PUBLIC",
        "file_path": "repository/structured/KA-KIMCHI-2026-001.md",
        "summary": "Full summary of kimchi fermentation.",
    }

    # 1. POST /knowledge
    response = client.post("/knowledge", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["asset_id"] == "KA-KIMCHI-2026-001"
    assert data["qcode"] == "Q-KIM-FERM-001"

    # 2. GET /knowledge/{id}
    get_res = client.get("/knowledge/KA-KIMCHI-2026-001")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Kimchi Fermentation Biology"

    # 3. GET /knowledge by qcode
    qcode_res = client.get("/knowledge/Q-KIM-FERM-001")
    assert qcode_res.status_code == 200
    assert qcode_res.json()["asset_id"] == "KA-KIMCHI-2026-001"


def test_list_knowledge_assets_pagination(client):
    # Create 3 assets
    for i in range(1, 4):
        payload = {
            "asset_id": f"KA-LIST-{i}",
            "qcode": f"Q-LIST-{i}",
            "domain_code": "LIST",
            "title": f"List Asset {i}",
            "file_path": f"repository/structured/KA-LIST-{i}.md",
        }
        res = client.post("/knowledge", json=payload)
        assert res.status_code == 201

    # List page 1 size 2
    res = client.get("/knowledge?domain=LIST&page=1&page_size=2")
    assert res.status_code == 200
    body = res.json()
    assert len(body["items"]) == 2
    assert body["meta"]["total_items"] == 3
    assert body["meta"]["has_next"] is True


def test_update_knowledge_asset(client):
    payload = {
        "asset_id": "KA-UPDATE-01",
        "qcode": "Q-UPDATE-01",
        "domain_code": "UPDATE",
        "title": "Initial Title",
        "file_path": "repository/structured/KA-UPDATE-01.md",
    }
    client.post("/knowledge", json=payload)

    # PUT update title and verification score
    update_payload = {
        "title": "Updated Title",
        "verification_score": 0.99,
    }
    res = client.put("/knowledge/KA-UPDATE-01", json=update_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Updated Title"
    assert data["verification_score"] == 0.99


def test_delete_knowledge_asset(client):
    payload = {
        "asset_id": "KA-DELETE-01",
        "qcode": "Q-DELETE-01",
        "domain_code": "DELETE",
        "title": "To Be Deleted",
        "file_path": "repository/structured/KA-DELETE-01.md",
    }
    client.post("/knowledge", json=payload)

    # DELETE /knowledge/{id}
    res = client.delete("/knowledge/KA-DELETE-01")
    assert res.status_code == 200
    assert res.json()["status"] == "SUCCESS"

    # Subsequent GET returns 404
    get_res = client.get("/knowledge/KA-DELETE-01")
    assert get_res.status_code == 404
    assert get_res.json()["error"]["code"] == "ACPP-ERR-4040"
