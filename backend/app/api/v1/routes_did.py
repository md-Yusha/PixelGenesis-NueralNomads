"""DID routes."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.db.session import get_db
from app.schemas.did import DIDCreate, DIDResponse
from app.services.did_service import did_service

router = APIRouter()


@router.post("", response_model=DIDResponse, status_code=status.HTTP_201_CREATED)
def create_did(
    current_user: CurrentUser,
    db: Annotated[Session, Depends(get_db)]
):
    """Create a DID for the current user."""
    db_did = did_service.create_did_for_user(db, current_user)
    return DIDResponse.model_validate(db_did)


@router.get("/me", response_model=DIDResponse)
def get_my_did(
    current_user: CurrentUser,
    db: Annotated[Session, Depends(get_db)]
):
    """Get the DID document of the current user."""
    if not current_user.did:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not have a DID. Create one first."
        )
    
    from app.db.models.did import DID
    db_did = db.query(DID).filter(DID.did == current_user.did).first()
    
    if not db_did:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DID not found"
        )
    
    return DIDResponse.model_validate(db_did)


@router.get("/{did}", response_model=dict)
def get_did_document(
    did: str,
    db: Annotated[Session, Depends(get_db)]
):
    """Get a public DID Document by DID string."""
    document = did_service.get_did_document(db, did)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DID not found"
        )
    return document

