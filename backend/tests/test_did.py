"""Tests for DID service."""
import pytest
from sqlalchemy.orm import Session

from app.db.models.user import User, UserRole
from app.services.did_service import did_service


def test_create_did_for_user(db_session: Session):
    """Test creating a DID for a user."""
    # Create a test user
    user = User(
        email="test@example.com",
        password_hash="hashed_password",
        role=UserRole.HOLDER
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create DID
    did = did_service.create_did_for_user(db_session, user)

    assert did is not None
    assert did.did is not None
    assert did.did.startswith("did:example:")
    assert did.user_id == user.id
    assert did.document is not None
    assert "id" in did.document
    assert did.document["id"] == did.did

    # Verify user's did field is updated
    db_session.refresh(user)
    assert user.did == did.did


def test_get_did_document(db_session: Session):
    """Test retrieving a DID document."""
    # Create user and DID
    user = User(
        email="test2@example.com",
        password_hash="hashed_password",
        role=UserRole.HOLDER
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    did = did_service.create_did_for_user(db_session, user)

    # Retrieve document
    document = did_service.get_did_document(db_session, did.did)

    assert document is not None
    assert document["id"] == did.did
    assert "verificationMethod" in document


def test_get_nonexistent_did_document(db_session: Session):
    """Test retrieving a non-existent DID document."""
    document = did_service.get_did_document(db_session, "did:example:nonexistent")
    assert document is None

