import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


@pytest.mark.skip
def test_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
