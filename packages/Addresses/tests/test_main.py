from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_own_items():
    response = client.get("/addresses")
    assert response.status_code == 200
    assert len(response.json()) == 5
