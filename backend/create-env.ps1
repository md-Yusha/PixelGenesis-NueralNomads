# PowerShell script to create .env file from template
# Run this script: .\create-env.ps1

$envContent = @"
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

# IPFS Configuration (Pinata - recommended)
PIXELGENESIS_IPFS_PROVIDER=pinata
PIXELGENESIS_IPFS_API_URL=https://api.pinata.cloud
PIXELGENESIS_IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs
PIXELGENESIS_IPFS_API_TOKEN=YOUR_PINATA_JWT_TOKEN
# Alternative: For web3.storage, set PIXELGENESIS_IPFS_PROVIDER=web3storage and update URLs

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
"@

$envFile = ".env"

if (Test-Path $envFile) {
    Write-Host ".env file already exists. Backing up to .env.backup" -ForegroundColor Yellow
    Copy-Item $envFile "$envFile.backup"
}

$envContent | Out-File -FilePath $envFile -Encoding utf8
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "Please update the following values when ready:" -ForegroundColor Yellow
Write-Host "  - PIXELGENESIS_IPFS_API_TOKEN (get JWT token from https://app.pinata.cloud/)" -ForegroundColor Cyan
Write-Host "  - SECRET_KEY (generate a strong random string for production)" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL (if using local PostgreSQL instead of Docker)" -ForegroundColor Cyan

