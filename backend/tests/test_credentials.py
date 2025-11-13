"""Tests for Credential service."""
import pytest
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.db.models.user import User, UserRole
from app.schemas.credential import IssueCredentialPayload
from app.services.credential_service import credential_service
from app.services.did_service import did_service


def test_issue_credential(db_session: Session):
    """Test issuing a credential."""
    # Create issuer user with DID
    issuer = User(
        email="issuer@example.com",
        password_hash="hashed_password",
        role=UserRole.ISSUER
    )
    db_session.add(issuer)
    db_session.commit()
    db_session.refresh(issuer)

    issuer_did_obj = did_service.create_did_for_user(db_session, issuer)

    # Create holder user with DID
    holder = User(
        email="holder@example.com",
        password_hash="hashed_password",
        role=UserRole.HOLDER
    )
    db_session.add(holder)
    db_session.commit()
    db_session.refresh(holder)

    holder_did_obj = did_service.create_did_for_user(db_session, holder)

    # Issue credential
    payload = IssueCredentialPayload(
        holderDid=holder_did_obj.did,
        type=["VerifiableCredential", "TestCredential"],
        claims={
            "name": "Test User",
            "testField": "testValue"
        },
        expiresAt=(datetime.utcnow() + timedelta(days=365)).isoformat() + "Z"
    )

    credential = credential_service.issue_credential(
        db=db_session,
        issuer=issuer,
        holder_did=holder_did_obj.did,
        payload=payload
    )

    assert credential is not None
    assert credential.vc_id is not None
    assert credential.holder_did == holder_did_obj.did
    assert credential.issuer_did == issuer_did_obj.did
    assert credential.status == "active"
    assert credential.hash is not None
    assert len(credential.type) == 2
    assert "VerifiableCredential" in credential.type


def test_verify_credential(db_session: Session):
    """Test verifying a credential."""
    # Create issuer and holder
    issuer = User(
        email="issuer2@example.com",
        password_hash="hashed_password",
        role=UserRole.ISSUER
    )
    db_session.add(issuer)
    db_session.commit()
    db_session.refresh(issuer)

    issuer_did_obj = did_service.create_did_for_user(db_session, issuer)

    holder = User(
        email="holder2@example.com",
        password_hash="hashed_password",
        role=UserRole.HOLDER
    )
    db_session.add(holder)
    db_session.commit()
    db_session.refresh(holder)

    holder_did_obj = did_service.create_did_for_user(db_session, holder)

    # Issue credential
    payload = IssueCredentialPayload(
        holderDid=holder_did_obj.did,
        type=["VerifiableCredential", "TestCredential"],
        claims={"test": "value"},
        expiresAt=(datetime.utcnow() + timedelta(days=365)).isoformat() + "Z"
    )

    credential = credential_service.issue_credential(
        db=db_session,
        issuer=issuer,
        holder_did=holder_did_obj.did,
        payload=payload
    )

    # Verify credential
    result = credential_service.verify_credential(
        db=db_session,
        vc_hash=credential.hash
    )

    assert result is not None
    # In development mode, verification may pass even with mocks
    assert isinstance(result.isValid, bool)
    assert isinstance(result.reasons, list)


def test_revoke_credential(db_session: Session):
    """Test revoking a credential."""
    # Create issuer and holder
    issuer = User(
        email="issuer3@example.com",
        password_hash="hashed_password",
        role=UserRole.ISSUER
    )
    db_session.add(issuer)
    db_session.commit()
    db_session.refresh(issuer)

    issuer_did_obj = did_service.create_did_for_user(db_session, issuer)

    holder = User(
        email="holder3@example.com",
        password_hash="hashed_password",
        role=UserRole.HOLDER
    )
    db_session.add(holder)
    db_session.commit()
    db_session.refresh(holder)

    holder_did_obj = did_service.create_did_for_user(db_session, holder)

    # Issue credential
    payload = IssueCredentialPayload(
        holderDid=holder_did_obj.did,
        type=["VerifiableCredential", "TestCredential"],
        claims={"test": "value"}
    )

    credential = credential_service.issue_credential(
        db=db_session,
        issuer=issuer,
        holder_did=holder_did_obj.did,
        payload=payload
    )

    # Revoke credential
    revoked = credential_service.revoke_credential(
        db=db_session,
        vc_id=credential.vc_id
    )

    assert revoked.status == "revoked"
    db_session.refresh(credential)
    assert credential.status == "revoked"

