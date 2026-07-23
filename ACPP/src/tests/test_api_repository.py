"""
Repository Status API Tests
============================
Tests GET /repository/status and GET /api/v1/repository/status endpoints.
"""

def test_repository_status_endpoint(client):
    response = client.get("/repository/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert data["database_connected"] is True
    assert "total_knowledge_assets" in data
    assert "storage_engine" in data


def test_api_v1_repository_status_endpoint(client):
    response = client.get("/api/v1/repository/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert data["database_connected"] is True
