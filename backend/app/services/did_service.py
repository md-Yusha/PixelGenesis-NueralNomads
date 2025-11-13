"""DID service for creating and managing Decentralized Identifiers."""
import hashlib
import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models.did import DID
from app.db.models.user import User
from app.schemas.did import DIDDocument, VerificationMethod


class DIDService:
    """Service for managing DIDs."""

    def create_did_for_user(self, db: Session, user: User) -> DID:
        """
        Create a DID for a user.
        
        Args:
            db: Database session
            user: User model instance
            
        Returns:
            Created DID model instance
        """
        # Check if user already has a DID
        existing_did = db.query(DID).filter(DID.user_id == user.id).first()
        if existing_did:
            return existing_did

        # Generate a unique identifier
        unique_id = str(uuid.uuid4())
        did_string = f"{settings.PIXELGENESIS_DID_METHOD}:{unique_id}"

        # Create minimal DID Document
        # In production, generate actual key pairs
        verification_method_id = f"{did_string}#keys-1"
        public_key_multibase = self._generate_mock_public_key(did_string)

        verification_method = VerificationMethod(
            id=verification_method_id,
            type="EcdsaSecp256k1VerificationKey2019",
            controller=did_string,
            publicKeyMultibase=public_key_multibase
        )

        did_document = DIDDocument(
            id=did_string,
            controller=None,
            verificationMethod=[verification_method],
            authentication=[verification_method_id]
        )

        # Create DID record
        db_did = DID(
            did=did_string,
            controller=None,
            document=did_document.model_dump(),
            user_id=user.id
        )

        db.add(db_did)
        db.commit()
        db.refresh(db_did)

        # Update user's did field
        user.did = did_string
        db.commit()

        return db_did

    def get_did_document(self, db: Session, did: str) -> dict[str, Any] | None:
        """
        Retrieve a DID Document by DID string.
        
        Args:
            db: Database session
            did: DID string
            
        Returns:
            DID Document as dictionary, or None if not found
        """
        db_did = db.query(DID).filter(DID.did == did).first()
        if db_did:
            return db_did.document
        return None

    def _generate_mock_public_key(self, did: str) -> str:
        """
        Generate a mock public key for development.
        In production, use proper cryptographic key generation.
        
        Args:
            did: DID string
            
        Returns:
            Mock public key in multibase format
        """
        # Generate a deterministic mock key from DID
        hash_obj = hashlib.sha256(did.encode())
        hash_hex = hash_obj.hexdigest()
        # Return as multibase (z prefix indicates base58btc)
        return f"z{hash_hex[:64]}"


# Global service instance
did_service = DIDService()


