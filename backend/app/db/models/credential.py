"""Credential database model."""
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Index, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class CredentialStatus(str, PyEnum):
    """Credential status enumeration."""
    ACTIVE = "active"
    REVOKED = "revoked"


class Credential(Base):
    """Credential model representing a Verifiable Credential."""

    __tablename__ = "credentials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vc_id = Column(String, unique=True, index=True, nullable=False)  # VC.id
    holder_did = Column(String, index=True, nullable=False)
    issuer_did = Column(String, index=True, nullable=False)
    type = Column(JSONB, nullable=False)  # Array of type strings
    status = Column(String, nullable=False, default=CredentialStatus.ACTIVE)
    issued_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    claims = Column(JSONB, nullable=False)
    proof = Column(JSONB, nullable=True)
    onchain_tx_hash = Column(String, nullable=True)
    hash = Column(String, index=True, nullable=False)  # Hash of the VC
    storage_cid = Column(String, nullable=True)  # IPFS CID
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Index for faster queries
    __table_args__ = (
        Index("idx_holder_did_status", "holder_did", "status"),
    )

    # Note: issuer_did is a DID string, not a foreign key to User.id
    # To get the issuer user, query by User.did == issuer_did


