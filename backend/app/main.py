from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, hosted_zones, records

# Create SQLite tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AWS Route53 Clone API",
    description="Backend REST API mimicking Route53 Hosted Zones and DNS Record workflows",
    version="1.0.0"
)

# Enable CORS for Next.js frontend running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(hosted_zones.router, prefix="/api/hosted-zones", tags=["Hosted Zones"])
app.include_router(records.router, prefix="/api/records", tags=["DNS Records"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AWS Route53 API Backend"}