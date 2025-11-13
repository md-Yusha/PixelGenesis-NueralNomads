"""DID database model."""
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class DID(Base):
    """DID model representing a Decentralized Identifier."""

    __tablename__ = "dids"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    did = Column(String, unique=True, index=True, nullable=False)
    controller = Column(String, nullable=True)
    document = Column(JSONB, nullable=False)  # Full DID Document
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="dids")


