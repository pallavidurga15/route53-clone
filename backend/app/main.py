from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3

app = FastAPI(title="AWS Route 53 API Backend")

# Enable CORS for Vercel frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite Database Setup
DB_FILE = "route53.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS hosted_zones (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            record_count INTEGER DEFAULT 2,
            comment TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Models
class ZoneCreate(BaseModel):
    name: str
    comment: Optional[str] = ""

class HostedZone(BaseModel):
    id: str
    name: str
    type: str
    record_count: int
    comment: Optional[str] = ""

@app.get("/")
def read_root():
    return {"status": "ok", "service": "AWS Route53 API Backend"}

@app.get("/hosted-zones", response_model=List[HostedZone])
@app.get("/hosted-zones/", response_model=List[HostedZone])
def get_hosted_zones():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, type, record_count, comment FROM hosted_zones")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        HostedZone(
            id=row[0],
            name=row[1],
            type=row[2],
            record_count=row[3],
            comment=row[4]
        )
        for row in rows
    ]

@app.post("/hosted-zones", response_model=HostedZone)
@app.post("/hosted-zones/", response_model=HostedZone)
def create_hosted_zone(zone: ZoneCreate):
    import uuid
    zone_id = f"Z{uuid.uuid4().hex[:12].upper()}"
    zone_type = "Public"
    record_count = 2
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO hosted_zones (id, name, type, record_count, comment) VALUES (?, ?, ?, ?, ?)",
        (zone_id, zone.name, zone_type, record_count, zone.comment)
    )
    conn.commit()
    conn.close()
    
    return HostedZone(
        id=zone_id,
        name=zone.name,
        type=zone_type,
        record_count=record_count,
        comment=zone.comment
    )