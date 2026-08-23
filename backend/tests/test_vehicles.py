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


class TestVehicleSearch:

    @staticmethod
    def seed_vehicles(client, admin_headers):
        vehicles = [
            {"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.00, "quantity": 5},
            {"make": "Toyota", "model": "RAV4", "category": "SUV", "price": 35000.00, "quantity": 3},
            {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 20000.00, "quantity": 4},
            {"make": "Ford", "model": "Mustang", "category": "Coupe", "price": 45000.00, "quantity": 2},
        ]
        for v in vehicles:
            client.post("/api/vehicles", json=v, headers=admin_headers)

    def test_search_by_make(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?make=Toyota", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 2
        assert all(v["make"] == "Toyota" for v in results)

    def test_search_by_model(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?model=Civic", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 1
        assert results[0]["model"] == "Civic"

    def test_search_by_category(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?category=Sedan", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 2
        assert all(v["category"] == "Sedan" for v in results)

    def test_search_by_min_price(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?min_price=35000", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 2
        assert all(v["price"] >= 35000 for v in results)

    def test_search_by_max_price(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?max_price=25000", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 2
        assert all(v["price"] <= 25000 for v in results)

    def test_search_by_price_range(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?min_price=20000&max_price=35000", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 3
        assert all(20000 <= v["price"] <= 35000 for v in results)

    def test_search_combined_filters(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?make=Toyota&category=SUV", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 1
        assert results[0]["model"] == "RAV4"

    def test_search_invalid_price_range(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?min_price=50000&max_price=10000", headers=user_headers)
        assert response.status_code == 422

    def test_search_no_results(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?make=Ferrari", headers=user_headers)
        assert response.status_code == 200
        assert response.json() == []

    def test_search_requires_auth(self, client):
        response = client.get("/api/vehicles/search?make=Toyota")
        assert response.status_code == 403

    def test_search_partial_match(self, client, admin_headers, user_headers):
        self.seed_vehicles(client, admin_headers)
        response = client.get("/api/vehicles/search?make=toy", headers=user_headers)
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 2


class TestVehicleUpdate:

    def test_update_vehicle_as_admin(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.put(f"/api/vehicles/{vehicle_id}", json={
            "price": 27000.00,
            "quantity": 10
        }, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["price"] == 27000.00
        assert data["quantity"] == 10
        assert data["make"] == "Toyota"

    def test_update_vehicle_as_user_forbidden(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.put(f"/api/vehicles/{vehicle_id}", json={
            "price": 27000.00
        }, headers=user_headers)
        assert response.status_code == 403

    def test_update_vehicle_not_found(self, client, admin_headers):
        response = client.put("/api/vehicles/99999", json={
            "price": 27000.00
        }, headers=admin_headers)
        assert response.status_code == 404

    def test_update_vehicle_partial(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.put(f"/api/vehicles/{vehicle_id}", json={
            "make": "Lexus"
        }, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["make"] == "Lexus"
        assert data["model"] == sample_vehicle["model"]
        assert data["price"] == sample_vehicle["price"]

    def test_update_vehicle_invalid_price(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.put(f"/api/vehicles/{vehicle_id}", json={
            "price": -500.00
        }, headers=admin_headers)
        assert response.status_code == 422


class TestVehicleDelete:

    def test_delete_vehicle_as_admin(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
        assert response.status_code == 204

    def test_delete_vehicle_no_longer_exists(self, client, admin_headers, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        assert all(v["id"] != vehicle_id for v in response.json())

    def test_delete_vehicle_as_user_forbidden(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.delete(f"/api/vehicles/{vehicle_id}", headers=user_headers)
        assert response.status_code == 403

    def test_delete_vehicle_unauthenticated(self, client, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.delete(f"/api/vehicles/{vehicle_id}")
        assert response.status_code == 403

    def test_delete_vehicle_not_found(self, client, admin_headers):
        response = client.delete("/api/vehicles/99999", headers=admin_headers)
        assert response.status_code == 404
