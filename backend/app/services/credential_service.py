"""Credential service for issuing and verifying Verifiable Credentials."""
import hashlib
import json
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models.credential import Credential, CredentialStatus
from app.db.models.user import User
from app.schemas.credential import IssueCredentialPayload, Proof, VerificationResult, VerifiableCredential
from app.services.blockchain_service import blockchain_service
from app.services.ipfs_service import ipfs_service


class CredentialService:
    """Service for managing Verifiable Credentials."""

    def issue_credential(
        self,
        db: Session,
        issuer: User,
        holder_did: str,
        payload: IssueCredentialPayload
    ) -> Credential:
        """
        Issue a Verifiable Credential.
        
        Args:
            db: Database session
            issuer: Issuer user model
            holder_did: DID of the credential holder
            payload: Credential issuance payload
            
        Returns:
            Created Credential model instance
        """
        # Generate VC ID
        vc_id = f"vc:{uuid.uuid4()}"

        # Get issuer DID
        issuer_did = issuer.did
        if not issuer_did:
            raise ValueError("Issuer must have a DID to issue credentials")

        # Build VC object
        issued_at = datetime.utcnow().isoformat() + "Z"
        expires_at = payload.expiresAt

        vc = VerifiableCredential(
            id=vc_id,
            holderDid=holder_did,
            issuerDid=issuer_did,
            type=payload.type,
            issuedAt=issued_at,
            expiresAt=expires_at,
            status=CredentialStatus.ACTIVE,
            credentialSchema=payload.credentialSchema,
            claims=payload.claims,
            proof=None  # Will be added after signing
        )

        # Sign the VC (stub implementation)
        proof = self._sign_vc(vc, issuer_did)
        vc.proof = proof

        # Compute hash of normalized VC JSON
        vc_dict = vc.model_dump(exclude_none=True)
        vc_hash = self._compute_vc_hash(vc_dict)

        # Store VC to IPFS (optional)
        storage_cid = None
        try:
            storage_cid = ipfs_service.upload_json(vc_dict)
        except Exception as e:
            # Log error but continue if IPFS fails
            if settings.is_development:
                storage_cid = f"mock_cid_{vc_hash[:16]}"
            else:
                # In production, you might want to fail or retry
                pass

        # Register hash on-chain
        onchain_tx_hash = None
        try:
            # In production, use actual private key from issuer
            # For now, use mock in development
            onchain_tx_hash = blockchain_service.register_vc_hash(vc_hash, private_key=None)
        except Exception as e:
            # Log error but continue if blockchain fails
            if not settings.is_development:
                raise

        # Create database record
        db_credential = Credential(
            vc_id=vc_id,
            holder_did=holder_did,
            issuer_did=issuer_did,
            type=payload.type,
            status=CredentialStatus.ACTIVE,
            issued_at=datetime.fromisoformat(issued_at.replace("Z", "+00:00")),
            expires_at=datetime.fromisoformat(expires_at.replace("Z", "+00:00")) if expires_at else None,
            claims=payload.claims,
            proof=proof.model_dump() if proof else None,
            onchain_tx_hash=onchain_tx_hash,
            hash=vc_hash,
            storage_cid=storage_cid
        )

        db.add(db_credential)
        db.commit()
        db.refresh(db_credential)

        return db_credential

    def verify_credential(self, db: Session, vc: dict[str, Any] | None = None, vc_hash: str | None = None) -> VerificationResult:
        """
        Verify a Verifiable Credential.
        
        Args:
            db: Database session
            vc: Full VC dictionary (optional)
            vc_hash: VC hash for lookup (optional)
            
        Returns:
            VerificationResult with validation status and reasons
        """
        reasons = []
        is_valid = True

        # If only hash provided, try to load from DB
        if vc_hash and not vc:
            db_credential = db.query(Credential).filter(Credential.hash == vc_hash).first()
            if db_credential:
                vc = {
                    "id": db_credential.vc_id,
                    "holderDid": db_credential.holder_did,
                    "issuerDid": db_credential.issuer_did,
                    "type": db_credential.type,
                    "issuedAt": db_credential.issued_at.isoformat() + "Z",
                    "expiresAt": db_credential.expires_at.isoformat() + "Z" if db_credential.expires_at else None,
                    "status": db_credential.status,
                    "claims": db_credential.claims,
                    "proof": db_credential.proof
                }
            else:
                reasons.append("Credential not found in database")
                is_valid = False

        if not vc:
            return VerificationResult(
                isValid=False,
                reasons=["No credential data provided"],
                onChainStatus=None,
                expiryStatus=None
            )

        # Verify signature (stub - in production, implement proper signature verification)
        if "proof" in vc and vc["proof"]:
            # Stub: assume valid if proof exists
            pass
        else:
            reasons.append("Missing or invalid proof")
            is_valid = False

        # Check expiry
        expiry_status = None
        if "expiresAt" in vc and vc["expiresAt"]:
            expires_at = datetime.fromisoformat(vc["expiresAt"].replace("Z", "+00:00"))
            if datetime.utcnow() > expires_at:
                reasons.append("Credential has expired")
                is_valid = False
                expiry_status = "expired"
            else:
                expiry_status = "valid"
        else:
            expiry_status = "no_expiry"

        # Check on-chain status
        onchain_status = None
        if vc_hash:
            try:
                is_revoked = blockchain_service.is_vc_revoked(vc_hash)
                if is_revoked:
                    reasons.append("Credential is revoked on-chain")
                    is_valid = False
                    onchain_status = "revoked"
                else:
                    onchain_status = "active"
            except Exception as e:
                if not settings.is_development:
                    reasons.append(f"Failed to check on-chain status: {str(e)}")
                    is_valid = False
                onchain_status = "unknown"
        else:
            # Compute hash from VC
            vc_hash = self._compute_vc_hash(vc)
            try:
                is_revoked = blockchain_service.is_vc_revoked(vc_hash)
                if is_revoked:
                    reasons.append("Credential is revoked on-chain")
                    is_valid = False
                    onchain_status = "revoked"
                else:
                    onchain_status = "active"
            except Exception as e:
                if not settings.is_development:
                    reasons.append(f"Failed to check on-chain status: {str(e)}")
                    is_valid = False
                onchain_status = "unknown"

        # Check database status
        if "status" in vc:
            if vc["status"] == CredentialStatus.REVOKED:
                reasons.append("Credential is revoked in database")
                is_valid = False

        return VerificationResult(
            isValid=is_valid,
            reasons=reasons if reasons else ["Credential is valid"],
            onChainStatus=onchain_status,
            expiryStatus=expiry_status
        )

    def revoke_credential(self, db: Session, vc_id: str | None = None, vc_hash: str | None = None) -> Credential:
        """
        Revoke a Verifiable Credential.
        
        Args:
            db: Database session
            vc_id: VC ID (optional)
            vc_hash: VC hash (optional)
            
        Returns:
            Updated Credential model instance
        """
        # Find credential
        if vc_id:
            db_credential = db.query(Credential).filter(Credential.vc_id == vc_id).first()
        elif vc_hash:
            db_credential = db.query(Credential).filter(Credential.hash == vc_hash).first()
        else:
            raise ValueError("Either vc_id or vc_hash must be provided")

        if not db_credential:
            raise ValueError("Credential not found")

        if db_credential.status == CredentialStatus.REVOKED:
            return db_credential  # Already revoked

        # Update database
        db_credential.status = CredentialStatus.REVOKED
        db.commit()

        # Revoke on-chain
        try:
            onchain_tx_hash = blockchain_service.revoke_vc_hash(db_credential.hash, private_key=None)
            db_credential.onchain_tx_hash = onchain_tx_hash
            db.commit()
        except Exception as e:
            if not settings.is_development:
                raise

        db.refresh(db_credential)
        return db_credential

    def _sign_vc(self, vc: VerifiableCredential, issuer_did: str) -> Proof:
        """
        Sign a Verifiable Credential (stub implementation).
        In production, use proper cryptographic signing.
        
        Args:
            vc: Verifiable Credential to sign
            issuer_did: Issuer DID
            
        Returns:
            Proof object
        """
        # Stub: create a mock signature
        # In production, use actual cryptographic signing with issuer's private key
        created = datetime.utcnow().isoformat() + "Z"
        verification_method = f"{issuer_did}#keys-1"
        
        # Mock JWS signature
        vc_json = json.dumps(vc.model_dump(exclude={"proof"}), sort_keys=True)
        signature_hash = hashlib.sha256(vc_json.encode()).hexdigest()
        jws = f"mock_signature_{signature_hash[:32]}"

        return Proof(
            type="EcdsaSecp256k1Signature2019",
            created=created,
            proofPurpose="assertionMethod",
            verificationMethod=verification_method,
            jws=jws
        )

    def _compute_vc_hash(self, vc_dict: dict[str, Any]) -> str:
        """
        Compute SHA-256 hash of normalized VC JSON.
        
        Args:
            vc_dict: VC as dictionary
            
        Returns:
            Hex string of the hash
        """
        # Normalize: sort keys and remove None values
        normalized = {k: v for k, v in sorted(vc_dict.items()) if v is not None}
        json_str = json.dumps(normalized, sort_keys=True, separators=(",", ":"))
        hash_obj = hashlib.sha256(json_str.encode())
        return hash_obj.hexdigest()


# Global service instance
credential_service = CredentialService()

