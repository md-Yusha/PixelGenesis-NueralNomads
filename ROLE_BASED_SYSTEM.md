# Role-Based System Setup Guide

## Overview

PixelLocker now supports a role-based access control system with four distinct roles:

1. **Owner** - Can add/remove issuers and verifiers
2. **Issuer** - Can issue credentials to users
3. **Verifier** - Can verify credentials (dashboard coming soon)
4. **User** - Default role with access to personal documents, DID management, and credential sharing

## Setup Instructions

### 1. Deploy Contracts

First, deploy the contracts including the new RoleManager:

```bash
npm run deploy
```

This will deploy:
- DIDRegistry
- CredentialManager
- **RoleManager** (new)

The deployer address will automatically become the owner.

### 2. Configure Owner Private Key

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add your owner private key:

```
VITE_OWNER_PRIVATE_KEY=your_owner_private_key_here
```

**Important:** 
- The owner private key should match the address that deployed the RoleManager contract
- Or you can use any private key and add that address as owner in the contract
- Never commit the `.env` file to version control

### 3. Install Dependencies

Install the new qrcode package:

```bash
cd frontend
npm install
```

### 4. Start the Application

```bash
npm run frontend
```

## Role Detection

The system detects user roles in the following order:

1. **Owner Detection**: Checks if the connected MetaMask address matches the owner private key from `.env`
2. **Contract Role Check**: Queries the RoleManager contract to check if the address is registered as an issuer or verifier
3. **Default**: If neither matches, the user is assigned the "user" role

## Dashboard Features by Role

### Owner Dashboard
- Add Issuers by their public key (Ethereum address)
- Add Verifiers by their public key (Ethereum address)
- Remove Issuers/Verifiers
- View list of all Issuers and Verifiers

### Issuer Dashboard
- View all credentials issued by the issuer
- Issue new credentials to users
- Revoke issued credentials

### User Dashboard
- **My Documents**: View all credentials issued to you and personal documents you uploaded
- **Upload Documents**: Upload personal documents to IPFS storage
- **DID Manager**: Register and manage your Decentralized Identifier
- **Share Credentials**: Select any document, enter recipient address, and generate a QR code for sharing

## Adding Roles

### As Owner:

1. Connect with the owner account (matching the private key in `.env`)
2. Navigate to "Owner Dashboard"
3. Enter the public key (Ethereum address) of the issuer/verifier
4. Click "Add Issuer" or "Add Verifier"

### For Issuers/Verifiers:

1. Owner adds your public key to the system
2. Connect with MetaMask using the account matching that public key
3. You'll automatically see the appropriate dashboard

## Share Credentials Feature

Users can share their documents (credentials or personal documents) with others:

1. Go to "Share Credentials" tab
2. Select a document from the list
3. Enter the recipient's Ethereum address
4. Click "Generate QR Code"
5. Recipient can scan the QR code to access the document

The QR code contains:
- Document metadata
- IPFS hash
- Sender and recipient addresses
- Timestamp
- Direct IPFS URL

## Security Notes

- Owner private key should be kept secure and never shared
- Only the owner can add/remove issuers and verifiers
- Issuers can only revoke credentials they issued
- Users can only share documents they own
- All documents are stored on IPFS (decentralized storage)

## Next Steps

- Verifier Dashboard (coming soon)
- Enhanced credential verification features
- Document access control and permissions

