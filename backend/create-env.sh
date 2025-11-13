#!/bin/bash
# Bash script to create .env file from template
# Run this script: bash create-env.sh

cat > .env << 'EOF'
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
# For Docker Compose (default):
DATABASE_URL=postgresql://pixelgenesis_user:pixelgenesis_password@localhost:5432/pixelgenesis_db
# For local PostgreSQL, update with your credentials:
# DATABASE_URL=postgresql://your_user:your_password@localhost:5432/pixelgenesis_db

# Security
# IMPORTANT: Change this to a strong random secret in production!
SECRET_KEY=dev-secret-key-change-in-production-use-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

echo ".env file created successfully!"
echo "Please update the following values when ready:"
echo "  - PIXELGENESIS_IPFS_API_TOKEN (get from https://web3.storage/)"
echo "  - SECRET_KEY (generate a strong random string for production)"
echo "  - DATABASE_URL (if using local PostgreSQL instead of Docker)"

