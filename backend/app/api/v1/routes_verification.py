"""Verification routes for verifying credentials."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.credential import VerificationResult, VerifyCredentialPayload
from app.services.credential_service import credential_service

router = APIRouter()


@router.post("/verify", response_model=VerificationResult)
def verify_credential(
    payload: VerifyCredentialPayload,
    db: Annotated[Session, Depends(get_db)]
):
    """Verify a Verifiable Credential."""
    result = credential_service.verify_credential(
        db=db,
        vc=payload.vc,
        vc_hash=payload.vcHash
    )
    return result

