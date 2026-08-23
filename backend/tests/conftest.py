import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def registered_user(client):
    payload = {"name": "Test User", "email": "user@example.com", "password": "password123"}
    client.post("/api/auth/register", json=payload)
    return payload


@pytest.fixture
def admin_user(client):
    payload = {"name": "Admin User", "email": "admin@example.com", "password": "adminpass123"}
    client.post("/api/auth/register", json=payload)
    # Promote to admin directly via DB
    db = TestingSessionLocal()
    from app.models import User
    user = db.query(User).filter(User.email == payload["email"]).first()
    user.role = "ADMIN"
    db.commit()
    db.close()
    return payload


@pytest.fixture
def user_token(client, registered_user):
    response = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    return response.json()["access_token"]


@pytest.fixture
def admin_token(client, admin_user):
    response = client.post("/api/auth/login", json={
        "email": admin_user["email"],
        "password": admin_user["password"],
    })
    return response.json()["access_token"]


@pytest.fixture
def user_headers(user_token):
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def sample_vehicle(client, admin_headers):
    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.00,
        "quantity": 5,
    }
    response = client.post("/api/vehicles", json=payload, headers=admin_headers)
    return response.json()
