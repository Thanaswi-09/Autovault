import pytest


class TestVehiclePurchase:

    def test_purchase_success(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Purchase successful"
        assert data["remaining_quantity"] == sample_vehicle["quantity"] - 1

    def test_purchase_decreases_quantity_by_one(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        vehicle = next(v for v in response.json() if v["id"] == vehicle_id)
        assert vehicle["quantity"] == sample_vehicle["quantity"] - 1

    def test_purchase_out_of_stock(self, client, admin_headers, user_headers):
        response = client.post("/api/vehicles", json={
            "make": "BMW", "model": "M3", "category": "Coupe",
            "price": 70000.00, "quantity": 0
        }, headers=admin_headers)
        vehicle_id = response.json()["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        assert response.status_code == 400

    def test_purchase_quantity_never_negative(self, client, admin_headers, user_headers):
        response = client.post("/api/vehicles", json={
            "make": "BMW", "model": "M3", "category": "Coupe",
            "price": 70000.00, "quantity": 1
        }, headers=admin_headers)
        vehicle_id = response.json()["id"]
        client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        assert response.status_code == 400
        response = client.get("/api/vehicles", headers=user_headers)
        vehicle = next(v for v in response.json() if v["id"] == vehicle_id)
        assert vehicle["quantity"] == 0

    def test_purchase_nonexistent_vehicle(self, client, user_headers):
        response = client.post("/api/vehicles/99999/purchase", headers=user_headers)
        assert response.status_code == 404

    def test_purchase_requires_auth(self, client, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/purchase")
        assert response.status_code == 403

    def test_purchase_multiple_times_tracks_correctly(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        original_qty = sample_vehicle["quantity"]
        for _ in range(3):
            client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        vehicle = next(v for v in response.json() if v["id"] == vehicle_id)
        assert vehicle["quantity"] == original_qty - 3


class TestVehicleRestock:

    def test_restock_success(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/restock",
                               json={"quantity": 10}, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Restock successful"
        assert data["new_quantity"] == sample_vehicle["quantity"] + 10

    def test_restock_increases_quantity(self, client, admin_headers, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        client.post(f"/api/vehicles/{vehicle_id}/restock",
                    json={"quantity": 5}, headers=admin_headers)
        response = client.get("/api/vehicles", headers=user_headers)
        vehicle = next(v for v in response.json() if v["id"] == vehicle_id)
        assert vehicle["quantity"] == sample_vehicle["quantity"] + 5

    def test_restock_as_user_forbidden(self, client, user_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/restock",
                               json={"quantity": 10}, headers=user_headers)
        assert response.status_code == 403

    def test_restock_unauthenticated(self, client, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/restock",
                               json={"quantity": 10})
        assert response.status_code == 403

    def test_restock_nonexistent_vehicle(self, client, admin_headers):
        response = client.post("/api/vehicles/99999/restock",
                               json={"quantity": 10}, headers=admin_headers)
        assert response.status_code == 404

    def test_restock_zero_quantity_rejected(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/restock",
                               json={"quantity": 0}, headers=admin_headers)
        assert response.status_code == 422

    def test_restock_negative_quantity_rejected(self, client, admin_headers, sample_vehicle):
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/restock",
                               json={"quantity": -5}, headers=admin_headers)
        assert response.status_code == 422
