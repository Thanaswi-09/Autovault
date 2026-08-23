import pytest


class TestUserRegistration:

    def test_register_success(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi Baddi",
            "email": "thanaswi@example.com",
            "password": "securepass123"
        })
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "thanaswi@example.com"
        assert data["name"] == "Thanaswi Baddi"
        assert data["role"] == "USER"
        assert "password" not in data
        assert "password_hash" not in data

    def test_register_duplicate_email(self, client):
        payload = {"name": "Thanaswi", "email": "dup@example.com", "password": "securepass123"}
        client.post("/api/auth/register", json=payload)
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 409

    def test_register_missing_name(self, client):
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "securepass123"
        })
        assert response.status_code == 422

    def test_register_missing_email(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi",
            "password": "securepass123"
        })
        assert response.status_code == 422

    def test_register_missing_password(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi",
            "email": "test@example.com"
        })
        assert response.status_code == 422

    def test_register_invalid_email_format(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi",
            "email": "not-an-email",
            "password": "securepass123"
        })
        assert response.status_code == 422

    def test_register_password_too_short(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi",
            "email": "test@example.com",
            "password": "123"
        })
        assert response.status_code == 422

    def test_register_returns_no_sensitive_data(self, client):
        response = client.post("/api/auth/register", json={
            "name": "Thanaswi",
            "email": "safe@example.com",
            "password": "securepass123"
        })
        assert response.status_code == 201
        data = response.json()
        assert "password" not in data
        assert "password_hash" not in data


class TestLogin:

    def test_login_success(self, client, registered_user):
        response = client.post("/api/auth/login", json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, registered_user):
        response = client.post("/api/auth/login", json={
            "email": registered_user["email"],
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    def test_login_unknown_email(self, client):
        response = client.post("/api/auth/login", json={
            "email": "nobody@example.com",
            "password": "somepassword",
        })
        assert response.status_code == 401

    def test_login_missing_email(self, client):
        response = client.post("/api/auth/login", json={"password": "securepass123"})
        assert response.status_code == 422

    def test_login_missing_password(self, client):
        response = client.post("/api/auth/login", json={"email": "user@example.com"})
        assert response.status_code == 422


class TestJWT:

    def test_protected_route_without_token(self, client):
        response = client.get("/api/vehicles")
        assert response.status_code == 403

    def test_protected_route_with_invalid_token(self, client):
        response = client.get("/api/vehicles", headers={"Authorization": "Bearer invalidtoken"})
        assert response.status_code == 401

    def test_protected_route_with_valid_token(self, client, user_headers):
        response = client.get("/api/vehicles", headers=user_headers)
        assert response.status_code == 200
