"""Credential Pydantic schemas."""
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel

from app.db.models.credential import CredentialStatus


class Proof(BaseModel):
    """VC Proof schema."""
    type: str
    created: str
    proofPurpose: str
    verificationMethod: str
    jws: str


class VerifiableCredential(BaseModel):
    """Verifiable Credential schema."""
    id: str
    holderDid: str
    issuerDid: str
    type: list[str]
    issuedAt: str
    expiresAt: str | None
    status: CredentialStatus
    credentialSchema: str | None = None
    claims: dict[str, Any]
    proof: Proof | None = None


class IssueCredentialPayload(BaseModel):
    """Schema for issuing a credential."""
    holderDid: str
    type: list[str]
    claims: dict[str, Any]
    expiresAt: str | None = None
    credentialSchema: str | None = None


class CredentialResponse(BaseModel):
    """Schema for credential response."""
    id: UUID
    vc_id: str
    holder_did: str
    issuer_did: str
    type: list[str]
    status: CredentialStatus
    issued_at: datetime
    expires_at: datetime | None
    claims: dict[str, Any]
    proof: dict[str, Any] | None
    onchain_tx_hash: str | None
    hash: str
    storage_cid: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RevokeCredentialPayload(BaseModel):
    """Schema for revoking a credential."""
    vcId: str | None = None
    hash: str | None = None


class VerificationResult(BaseModel):
    """Schema for credential verification result."""
    isValid: bool
    reasons: list[str]
    onChainStatus: str | None = None
    expiryStatus: str | None = None


class VerifyCredentialPayload(BaseModel):
    """Schema for verifying a credential."""
    vc: dict[str, Any] | None = None
    vcHash: str | None = None


