from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Vehicle
from app.schemas import VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Vehicle).all()
