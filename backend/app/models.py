from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class ZoneType(str, enum.Enum):
    PUBLIC = "Public hosted zone"
    PRIVATE = "Private hosted zone"

class RecordType(str, enum.Enum):
    A = "A"
    AAAA = "AAAA"
    CNAME = "CNAME"
    TXT = "TXT"
    MX = "MX"
    NS = "NS"
    PTR = "PTR"
    SRV = "SRV"
    CAA = "CAA"
    SOA = "SOA"  

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, index=True) # e.g., Z0123456789ABC
    name = Column(String, nullable=False, index=True)
    type = Column(Enum(ZoneType), default=ZoneType.PUBLIC)
    record_count = Column(Integer, default=2)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    records = relationship("DNSRecord", back_populates="zone", cascade="all, delete-orphan")

class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(RecordType), nullable=False)
    value = Column(String, nullable=False)
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")

    zone = relationship("HostedZone", back_populates="records")