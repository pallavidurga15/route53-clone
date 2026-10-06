import random
import string
from sqlalchemy.orm import Session
from . import models, schemas

def generate_zone_id() -> str:
    """Generates an AWS Route53 style Hosted Zone ID (e.g. Z0123456789ABC)."""
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=11))
    return f"Z{random_str}"

# --- Hosted Zones ---

def get_hosted_zones(db: Session, search: str = None):
    query = db.query(models.HostedZone)
    if search:
        query = query.filter(models.HostedZone.name.ilike(f"%{search}%"))
    return query.all()

def get_hosted_zone(db: Session, zone_id: str):
    return db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()

def create_hosted_zone(db: Session, zone: schemas.HostedZoneCreate):
    db_zone = models.HostedZone(
        id=generate_zone_id(),
        name=zone.name,
        type=zone.type,
        comment=zone.comment,
        record_count=2  # Default NS and SOA records in Route53
    )
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)

    # Auto-create default NS and SOA records like AWS Route53 does
    ns_record = models.DNSRecord(
        zone_id=db_zone.id,
        name=zone.name,
        type=models.RecordType.NS,
        value=f"ns-1.awsdns.com.\nns-2.awsdns.net.",
        ttl=172800,
        routing_policy="Simple"
    )
    soa_record = models.DNSRecord(
        zone_id=db_zone.id,
        name=zone.name,
        type=models.RecordType.SOA,
        value=f"ns-1.awsdns.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
        ttl=900,
        routing_policy="Simple"
    )
    db.add(ns_record)
    db.add(soa_record)
    db.commit()
    
    return db_zone

def update_hosted_zone(db: Session, zone_id: str, zone_update: schemas.HostedZoneCreate):
    db_zone = get_hosted_zone(db, zone_id)
    if not db_zone:
        return None
    db_zone.name = zone_update.name
    db_zone.type = zone_update.type
    db_zone.comment = zone_update.comment
    db.commit()
    db.refresh(db_zone)
    return db_zone

def delete_hosted_zone(db: Session, zone_id: str):
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        db.delete(db_zone)
        db.commit()
        return True
    return False

# --- DNS Records ---

def get_dns_records(db: Session, zone_id: str, search: str = None):
    query = db.query(models.DNSRecord).filter(models.DNSRecord.zone_id == zone_id)
    if search:
        query = query.filter(models.DNSRecord.name.ilike(f"%{search}%"))
    return query.all()

def create_dns_record(db: Session, record: schemas.DNSRecordCreate):
    db_record = models.DNSRecord(
        zone_id=record.zone_id,
        name=record.name,
        type=record.type,
        value=record.value,
        ttl=record.ttl,
        routing_policy=record.routing_policy
    )
    db.add(db_record)
    
    # Update record count on hosted zone
    db_zone = get_hosted_zone(db, record.zone_id)
    if db_zone:
        db_zone.record_count += 1
        
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_dns_record(db: Session, record_id: int):
    db_record = db.query(models.DNSRecord).filter(models.DNSRecord.id == record_id).first()
    if db_record:
        zone_id = db_record.zone_id
        db.delete(db_record)
        
        # Decrement record count
        db_zone = get_hosted_zone(db, zone_id)
        if db_zone and db_zone.record_count > 0:
            db_zone.record_count -= 1
            
        db.commit()
        return True
    return False