"""DID Pydantic schemas."""
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class VerificationMethod(BaseModel):
    """Verification method in DID Document."""
    id: str
    type: str
    controller: str
    publicKeyMultibase: str


class DIDDocument(BaseModel):
    """DID Document schema."""
    id: str
    controller: str | None = None
    verificationMethod: list[VerificationMethod]
    authentication: list[str]


class DIDCreate(BaseModel):
    """Schema for DID creation (no body needed, uses authenticated user)."""
    pass


class DIDResponse(BaseModel):
    """Schema for DID response."""
    id: UUID
    did: str
    controller: str | None
    document: dict[str, Any]
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


