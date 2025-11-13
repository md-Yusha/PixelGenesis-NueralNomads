# PixelGenesis Backend

Decentralized Digital Identity & Credential Vault Backend API built with FastAPI, PostgreSQL, and Web3 integration.

## Overview

PixelGenesis Backend provides a REST API for managing:
- **Decentralized Identifiers (DIDs)**: Self-sovereign identity identifiers
- **Verifiable Credentials (VCs)**: Digitally signed credentials stored on IPFS with on-chain proofs
- **User Management**: Authentication and role-based access control (Holder, Issuer, Verifier)

## Architecture

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Blockchain**: EVM-compatible chains via web3.py
- **Storage**: IPFS via web3.storage API
- **Authentication**: JWT tokens
- **Migrations**: Alembic

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py           # Settings and environment variables
│   │   └── security.py         # JWT and password hashing
│   ├── db/
│   │   ├── base.py             # SQLAlchemy base
│   │   ├── session.py          # Database session management
│   │   └── models/             # Database models (User, DID, Credential)
│   ├── schemas/                # Pydantic schemas for API
│   ├── api/
│   │   ├── deps.py             # API dependencies (auth, roles)
│   │   └── v1/                 # API v1 routes
│   │       ├── routes_auth.py
│   │       ├── routes_did.py
│   │       ├── routes_credentials.py
│   │       └── routes_verification.py
│   └── services/               # Business logic services
│       ├── did_service.py
│       ├── credential_service.py
│       ├── blockchain_service.py
│       └── ipfs_service.py
├── alembic/                    # Database migrations
├── tests/                      # Unit tests
├── pyproject.toml              # Poetry dependencies
├── requirements.txt            # pip dependencies (alternative)
└── README.md
```

## Prerequisites

- Python 3.11 or higher
- PostgreSQL 12+ (local or remote)
- Poetry (recommended) or pip
- Access to an EVM-compatible RPC endpoint (e.g., Polygon Mumbai testnet)
- Web3.Storage API token (for IPFS)

## Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

**Using Poetry (recommended):**
```bash
poetry install
poetry shell
```

**Using pip:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Note for Windows users:** The `web3` package (for blockchain integration) requires Microsoft Visual C++ Build Tools. You have two options:

1. **Skip web3 for development** (recommended): The backend will use mock mode for blockchain operations. Just install the base requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install web3 with build tools** (for production):
   - Download and install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Then install web3 separately:
     ```bash
     pip install -r requirements-web3.txt
     ```

### 3. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy from .env.example (if available) or create manually
```

Required environment variables:

```env
# Environment
PIXELGENESIS_ENV=development

# API URLs
PIXELGENESIS_API_BASE_URL=http://localhost:8000
PIXELGENESIS_WEB_BASE_URL=http://localhost:3000
PIXELGENESIS_MOBILE_DEEPLINK_SCHEME=pixelgenesis

# Blockchain Configuration
PIXELGENESIS_CHAIN_ID=80001
PIXELGENESIS_RPC_URL=https://rpc-mumbai.maticvigil.com
PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS=0xDID_REGISTRY_PLACEHOLDER
PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS=0xVC_REGISTRY_PLACEHOLDER

# IPFS Configuration
PIXELGENESIS_IPFS_API_URL=https://api.web3.storage
PIXELGENESIS_IPFS_GATEWAY_URL=https://w3s.link/ipfs
PIXELGENESIS_IPFS_API_TOKEN=YOUR_WEB3_STORAGE_TOKEN

# DID Configuration
PIXELGENESIS_DID_METHOD=did:example

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/pixelgenesis_db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Set Up PostgreSQL Database

**Using Docker:**
```bash
docker run --name pixelgenesis-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=pixelgenesis_db \
  -p 5432:5432 \
  -d postgres:15
```

**Or using local PostgreSQL:**
```bash
createdb pixelgenesis_db
```

### 5. Run Database Migrations

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## Running the Application

### Development Mode

```bash
# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### DID Management

- `POST /api/v1/did` - Create a DID for the current user (authenticated)
- `GET /api/v1/did/me` - Get current user's DID document (authenticated)
- `GET /api/v1/did/{did}` - Get a public DID document

### Credentials

- `POST /api/v1/credentials/issue` - Issue a new VC (issuer only)
- `GET /api/v1/credentials/me` - List user's credentials (holder)
- `POST /api/v1/credentials/revoke` - Revoke a VC (issuer only)

### Verification

- `POST /api/v1/credentials/verify` - Verify a VC

## Core Flows

### 1. Holder Onboarding

1. Register account: `POST /api/v1/auth/register` with `role: "holder"`
2. Login: `POST /api/v1/auth/login` → receive JWT token
3. Create DID: `POST /api/v1/did` (authenticated) → DID is generated and linked to user

### 2. Issuer Issues Credential

1. Issuer registers/logs in with `role: "issuer"`
2. Issuer creates DID (if not exists)
3. Issue credential: `POST /api/v1/credentials/issue`
   - Backend generates VC, signs it, computes hash
   - Stores VC to IPFS (optional)
   - Registers hash on-chain
   - Saves to database

### 3. Holder Views Credentials

1. Holder logs in
2. List credentials: `GET /api/v1/credentials/me` → returns all VCs for holder's DID

### 4. Verifier Verifies Credential

1. Verifier (or any user) calls: `POST /api/v1/credentials/verify`
   - Provide full VC JSON or `vcHash`
   - Backend checks:
     - Signature validity
     - On-chain revocation status
     - Expiry
   - Returns structured verification result

### 5. Revocation

1. Issuer calls: `POST /api/v1/credentials/revoke`
   - Updates status in database
   - Calls on-chain revocation function
   - Returns updated credential

## Testing

Run tests with pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_did.py
```

**Note**: Tests require a test database. Update `TEST_DATABASE_URL` in `conftest.py` if needed.

## Configuration

### Blockchain Setup

1. **RPC URL**: Set `PIXELGENESIS_RPC_URL` to your EVM RPC endpoint
2. **Contract Addresses**: Deploy DID and VC registry contracts, then set:
   - `PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS`
   - `PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS`
3. **Chain ID**: Set `PIXELGENESIS_CHAIN_ID` (e.g., 80001 for Polygon Mumbai)

**Note**: 
- In development mode, the blockchain service uses mock mode if:
  - `web3` is not installed (Windows users can skip it)
  - Contracts are not configured (using placeholder addresses)
  - RPC connection fails
- To use real blockchain operations, install web3: `pip install -r requirements-web3.txt`

### IPFS Setup

**Using Pinata (Recommended - Default):**
1. Sign up at https://www.pinata.cloud/
2. Create a JWT token in the API Keys section: https://app.pinata.cloud/
3. Set `PIXELGENESIS_IPFS_API_TOKEN` in `.env` with your Pinata JWT token
4. The service is already configured for Pinata by default

**Using web3.storage (Alternative):**
1. Set `PIXELGENESIS_IPFS_PROVIDER=web3storage` in `.env`
2. Get a Web3.Storage API token: https://web3.storage/
3. Update `PIXELGENESIS_IPFS_API_URL` and `PIXELGENESIS_IPFS_GATEWAY_URL` accordingly
4. Set `PIXELGENESIS_IPFS_API_TOKEN` with your web3.storage token

**Note**: In development mode, mock CIDs are returned if IPFS upload fails.

## Development Notes

### Mock Mode

In `development` environment:
- Blockchain service allows mock transactions if contracts are not configured
- IPFS service returns mock CIDs on failure
- This allows development without full blockchain/IPFS setup

### Signing

Current implementation uses stub signing for VCs. In production:
- Implement proper cryptographic signing with issuer's private key
- Use DID verification methods for signature verification
- Consider using libraries like `cryptography` or `pyld` for VC signing

### Database Models

- **User**: Stores user accounts with roles (holder, issuer, verifier)
- **DID**: Stores DID documents linked to users
- **Credential**: Stores VC metadata, claims, proofs, and on-chain hashes

### Security

- Passwords are hashed using bcrypt
- JWT tokens expire after `ACCESS_TOKEN_EXPIRE_MINUTES`
- Role-based access control enforced via dependencies
- Change `SECRET_KEY` in production!

## Production Deployment

1. Set `PIXELGENESIS_ENV=production`
2. Use a strong `SECRET_KEY`
3. Configure production database
4. Set up proper blockchain contracts and RPC
5. Configure IPFS with production credentials
6. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
7. Set up reverse proxy (nginx) for HTTPS
8. Enable CORS only for trusted origins

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
- Ensure database exists: `createdb pixelgenesis_db`

### Blockchain Connection Issues

- Verify RPC URL is accessible
- Check chain ID matches your network
- In development, mock mode will activate if connection fails

### IPFS Upload Issues

- Verify API token is valid
- Check network connectivity
- In development, mock CIDs will be returned

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.

