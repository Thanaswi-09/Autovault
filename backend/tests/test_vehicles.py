import pytest


class TestVehicleCreation:

    def test_create_vehicle_as_admin(self, client, admin_headers):
        response = client.post("/api/vehicles", json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000.00,
            "quantity": 5
        }, headers=admin_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["make"] == "Toyota"
        assert data["model"] == "Camry"
        assert data["category"] == "Sedan"
        assert data["price"] == 25000.00
        assert data["quantity"] == 5
        assert "id" in data

    def test_create_vehicle_as_user_forbidden(self, client, user_headers):
        response = client.post("/api/vehicles", json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 20000.00,
            "quantity": 3
        }, headers=user_headers)
        assert response.status_code == 403

    def test_create_vehicle_unauthenticated(self, client):
        response = client.post("/api/vehicles", json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 20000.00,
            "quantity": 3
        })
        assert response.status_code == 403

    def test_create_vehicle_negative_price(self, client, admin_headers):
        response = client.post("/api/vehicles", json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": -100.00,
            "quantity": 5
        }, headers=admin_headers)
        assert response.status_code == 422

    def test_create_vehicle_negative_quantity(self, client, admin_headers):
        response = client.post("/api/vehicles", json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000.00,
            "quantity": -1
        }, headers=admin_headers)
        assert response.status_code == 422

    def test_create_vehicle_missing_fields(self, client, admin_headers):
        response = client.post("/api/vehicles", json={
            "make": "Toyota",
            "model": "Camry"
        }, headers=admin_headers)
        assert response.status_code == 422

    def test_create_vehicle_empty_make(self, client, admin_headers):
        response = client.post("/api/vehicles", json={
            "make": "",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000.00,
            "quantity": 5
        }, headers=admin_headers)
        assert response.status_code == 422


class TestVehicleRetrieval:

    def test_list_vehicles_empty(self, client, user_headers):
        response = client.get("/api/vehicles", headers=user_headers)
        assert response.status_code == 200
        assert response.json() == []

    def test_list_vehicles_returns_all(self, client, admin_headers, user_headers):
        client.post("/api/vehicles", json={
            "make": "Toyota", "model": "Camry", "category": "Sedan",
            "price": 25000.00, "quantity": 5
        }, headers=admin_headers)
        client.post("/api/vehicles", json={
            "make": "Honda", "model": "Civic", "category": "Sedan",
            "price": 20000.00, "quantity": 3
        }, headers=admin_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_list_vehicles_requires_auth(self, client):
        response = client.get("/api/vehicles")
        assert response.status_code == 403

    def test_list_vehicles_response_shape(self, client, admin_headers, user_headers):
        client.post("/api/vehicles", json={
            "make": "Toyota", "model": "Camry", "category": "Sedan",
            "price": 25000.00, "quantity": 5
        }, headers=admin_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        vehicle = response.json()[0]
        assert "id" in vehicle
        assert "make" in vehicle
        assert "model" in vehicle
        assert "category" in vehicle
        assert "price" in vehicle
        assert "quantity" in vehicle
