from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.HostedZoneResponse])
def read_hosted_zones(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_hosted_zones(db, search=search)

@router.post("/", response_model=schemas.HostedZoneResponse)
def create_hosted_zone(zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    return crud.create_hosted_zone(db, zone)

@router.get("/{zone_id}", response_model=schemas.HostedZoneResponse)
def read_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    db_zone = crud.get_hosted_zone(db, zone_id)
    if not db_zone:
        raise HTTPException(status_code=404, detail="Hosted Zone not found")
    return db_zone

@router.put("/{zone_id}", response_model=schemas.HostedZoneResponse)
def update_hosted_zone(zone_id: str, zone_update: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    updated_zone = crud.update_hosted_zone(db, zone_id, zone_update)
    if not updated_zone:
        raise HTTPException(status_code=404, detail="Hosted Zone not found")
    return updated_zone

@router.delete("/{zone_id}")
def delete_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    success = crud.delete_hosted_zone(db, zone_id)
    if not success:
        raise HTTPException(status_code=404, detail="Hosted Zone not found")
    return {"message": "Hosted Zone deleted successfully"}