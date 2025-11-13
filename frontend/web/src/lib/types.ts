/**
 * Shared types for PixelGenesis dApp
 * Core concepts: DID, Verifiable Credentials, DID Documents
 * Must be consistent across backend, web, and mobile
 */

export enum UserRole {
  HOLDER = 'holder',
  ISSUER = 'issuer',
  VERIFIER = 'verifier',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

/**
 * Verifiable Credential model (simplified)
 * Matches PixelGenesis specification
 */
export interface VerifiableCredential {
  id: string; // VC ID (UUID or DID-URL)
  holderDid: string; // DID of the subject/holder
  issuerDid: string; // DID of the issuer
  type: string[]; // e.g. ["VerifiableCredential", "KYC", "AadhaarCredential"]
  issuedAt: string; // ISO timestamp
  expiresAt?: string | null; // ISO timestamp or null
  status: 'active' | 'revoked'; // current status
  credentialSchema?: string; // optional schema URL or ID
  claims: Record<string, any>; // e.g. { name, dob, aadhaarLast4, universityName, cgpa }
  proof?: {
    type: string; // e.g. "EcdsaSecp256k1Signature2019"
    created: string; // ISO timestamp
    proofPurpose: string; // e.g. "assertionMethod"
    verificationMethod: string; // DID URL for public key
    jws: string; // signature
  };
}

/**
 * DID Document (simplified)
 * Matches PixelGenesis specification
 */
export interface DIDDocument {
  id: string; // DID
  controller?: string; // controlling DID, if any
  verificationMethod: Array<{
    id: string;
    type: string; // key type name
    controller: string; // DID
    publicKeyMultibase: string; // public key
  }>;
  authentication: string[]; // references into verificationMethod
}

/**
 * DID representation in API responses
 * Includes metadata for frontend use
 */
export interface DID {
  did: string; // e.g. "did:example:123abc..."
  address: string; // Linked EVM address
  publicKey: string; // Public key
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

/**
 * Credential Record - database representation with metadata
 * Includes on-chain transaction hash and IPFS CID
 */
export interface CredentialRecord {
  id: string; // Database record ID
  vcId: string; // VC ID from VerifiableCredential
  type: string[]; // Credential types
  status: CredentialStatus; // 'active' | 'revoked'
  holderDid: string; // DID of the holder
  issuerDid: string; // DID of the issuer
  issuedAt: string; // ISO timestamp
  expiresAt?: string | null; // ISO timestamp or null
  onChainTxHash?: string; // Transaction hash from blockchain registry
  ipfsCid?: string; // IPFS CID where full VC is stored
  vc: VerifiableCredential; // Full VC object
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    did?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface IssueCredentialRequest {
  holderDid: string; // DID of the holder receiving the credential
  type: string[]; // e.g. ["VerifiableCredential", "KYC", "AadhaarCredential"]
  claims: Record<string, any>; // e.g. { name, dob, aadhaarLast4, universityName, cgpa }
  expiresAt?: string | null; // ISO timestamp or null
  credentialSchema?: string; // optional schema URL or ID
}

export interface IssueCredentialResponse {
  credential: CredentialRecord;
  transactionHash: string;
}

export interface VerifyCredentialRequest {
  vc?: VerifiableCredential;
  vcHash?: string;
  vcId?: string;
}

export interface VerifyCredentialResponse {
  valid: boolean;
  onChainStatus: string;
  expiryStatus: string;
  reasons: string[];
  credential?: CredentialRecord;
}

