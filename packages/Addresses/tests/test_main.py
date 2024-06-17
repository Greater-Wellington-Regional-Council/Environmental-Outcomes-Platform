import pytest
from httpx import Client, WSGITransport
from main import app


@pytest.fixture
def client():
    return Client(transport=WSGITransport(app=app))


def test_read_own_items(client):
    response = client.get("/addresses")
    assert response.status_code == 200
    assert len(response.json()) == 5
