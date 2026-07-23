"""
Health Check API Tests
=======================
Tests GET /health and GET /api/v1/health endpoints.
"""

def test_health_check_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("HEALTHY", "DEGRADED")
    assert data["version"] == "v3.1.0"
    assert "database_status" in data
    assert "X-Request-ID" in response.headers
    assert "X-Correlation-ID" in response.headers


def test_api_v1_health_check_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("HEALTHY", "DEGRADED")
