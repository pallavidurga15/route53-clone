from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Simple mock authentication
    if request.username and request.password:
        return {
            "status": "success",
            "user": {
                "username": request.username,
                "role": "IAM Admin",
                "account_id": "1234-5678-9012"
            },
            "token": "mock-aws-session-token-xyz789"
        }
    return {"status": "error", "message": "Invalid credentials"}