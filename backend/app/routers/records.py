from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/zone/{zone_id}", response_model=List[schemas.DNSRecordResponse])
def read_dns_records(zone_id: str, search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_dns_records(db, zone_id=zone_id, search=search)

@router.post("/", response_model=schemas.DNSRecordResponse)
def create_dns_record(record: schemas.DNSRecordCreate, db: Session = Depends(get_db)):
    return crud.create_dns_record(db, record)

@router.delete("/{record_id}")
def delete_dns_record(record_id: int, db: Session = Depends(get_db)):
    success = crud.delete_dns_record(db, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="DNS Record not found")
    return {"message": "DNS Record deleted successfully"}