"""
Error Handling Tests
====================
Tests for global exception handlers and custom error taxonomy.
"""

def test_validation_error_response_format(client):
    # Invalid payload missing required fields
    response = client.post("/knowledge", json={"invalid_key": "data"})
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "ACPP-ERR-4001"
    assert "details" in data["error"]


def test_not_found_error_response_format(client):
    response = client.get("/knowledge/KA-NON-EXISTENT")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "ACPP-ERR-4040"
    assert "KA-NON-EXISTENT" in data["error"]["message"]


def test_custom_security_headers_tracing(client):
    headers = {
        "X-Request-ID": "req-custom-123",
        "X-Correlation-ID": "corr-custom-456",
        "X-Agent-ID": "ACPP-AG-01",
    }
    response = client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == "req-custom-123"
    assert response.headers["X-Correlation-ID"] == "corr-custom-456"
