from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .models import ZoneType, RecordType

# --- DNS Record Schemas ---
class DNSRecordBase(BaseModel):
    name: str
    type: RecordType
    value: str
    ttl: int = 300
    routing_policy: str = "Simple"

class DNSRecordCreate(DNSRecordBase):
    zone_id: str

class DNSRecordResponse(DNSRecordBase):
    id: int
    zone_id: str

    class Config:
        from_attributes = True

# --- Hosted Zone Schemas ---
class HostedZoneBase(BaseModel):
    name: str
    type: ZoneType = ZoneType.PUBLIC
    comment: Optional[str] = None

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZoneResponse(HostedZoneBase):
    id: str
    record_count: int
    created_at: datetime
    records: List[DNSRecordResponse] = []

    class Config:
        from_attributes = True