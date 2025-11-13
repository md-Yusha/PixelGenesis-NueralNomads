"""Credential routes for issuing and managing credentials."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser, RequireIssuer
from app.db.models.credential import Credential
from app.db.session import get_db
from app.schemas.credential import (
    CredentialResponse,
    IssueCredentialPayload,
    RevokeCredentialPayload,
)
from app.services.credential_service import credential_service

router = APIRouter()


@router.post("/issue", response_model=CredentialResponse, status_code=status.HTTP_201_CREATED)
def issue_credential(
    payload: IssueCredentialPayload,
    issuer: RequireIssuer,
    db: Annotated[Session, Depends(get_db)]
):
    """Issue a new Verifiable Credential (issuer only)."""
    try:
        db_credential = credential_service.issue_credential(
            db=db,
            issuer=issuer,
            holder_did=payload.holderDid,
            payload=payload
        )
        return CredentialResponse.model_validate(db_credential)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/me", response_model=list[CredentialResponse])
def get_my_credentials(
    current_user: CurrentUser,
    db: Annotated[Session, Depends(get_db)]
):
    """Get all credentials for the current user (holder)."""
    if not current_user.did:
        return []
    
    credentials = db.query(Credential).filter(
        Credential.holder_did == current_user.did
    ).all()
    
    return [CredentialResponse.model_validate(cred) for cred in credentials]


@router.post("/revoke", response_model=CredentialResponse)
def revoke_credential(
    payload: RevokeCredentialPayload,
    issuer: RequireIssuer,
    db: Annotated[Session, Depends(get_db)]
):
    """Revoke a Verifiable Credential (issuer only)."""
    try:
        db_credential = credential_service.revoke_credential(
            db=db,
            vc_id=payload.vcId,
            vc_hash=payload.hash
        )
        return CredentialResponse.model_validate(db_credential)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

