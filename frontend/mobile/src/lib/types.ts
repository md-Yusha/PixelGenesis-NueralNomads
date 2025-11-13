// Shared types for PixelGenesis mobile app

export enum UserRole {
  HOLDER = 'holder',
  ISSUER = 'issuer',
  VERIFIER = 'verifier',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

export interface DIDDocument {
  id: string;
  controller?: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
}

export interface VCProof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws: string;
}

export interface VerifiableCredential {
  id: string;
  holderDid: string;
  issuerDid: string;
  type: string[];
  issuedAt: string;
  expiresAt?: string | null;
  status: CredentialStatus;
  credentialSchema?: string;
  claims: Record<string, any>;
  proof?: VCProof;
  storage_cid?: string; // IPFS CID for document storage
}

export interface DIDInfo {
  did: string;
  walletAddress?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  did?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface VerifyCredentialRequest {
  credential?: VerifiableCredential;
  credentialHash?: string;
}

export interface VerifyCredentialResponse {
  valid: boolean;
  reasons?: string[];
  credential?: VerifiableCredential;
}

