"""User database model."""
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, PyEnum):
    """User role enumeration."""
    HOLDER = "holder"
    ISSUER = "issuer"
    VERIFIER = "verifier"


class User(Base):
    """User model representing a system user."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.HOLDER)
    did = Column(String, nullable=True, unique=True, index=True)
    wallet_address = Column(String, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    dids = relationship("DID", back_populates="user", cascade="all, delete-orphan")


