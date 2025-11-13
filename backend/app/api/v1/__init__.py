"""API v1 routes."""
from fastapi import APIRouter

from app.api.v1.routes_auth import router as auth_router
from app.api.v1.routes_credentials import router as credentials_router
from app.api.v1.routes_did import router as did_router
from app.api.v1.routes_verification import router as verification_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(did_router, prefix="/did", tags=["did"])
api_router.include_router(credentials_router, prefix="/credentials", tags=["credentials"])
api_router.include_router(verification_router, prefix="/credentials", tags=["verification"])

