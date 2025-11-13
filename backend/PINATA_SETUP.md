# Pinata IPFS Setup Guide

## Why Pinata?

Pinata is a reliable IPFS pinning service that's easier to set up than web3.storage (which often has maintenance issues). It's the default IPFS provider for PixelGenesis.

## Quick Setup

### 1. Create a Pinata Account

1. Go to https://www.pinata.cloud/
2. Sign up for a free account
3. Verify your email

### 2. Generate JWT Token

1. Log in to Pinata: https://app.pinata.cloud/
2. Navigate to **API Keys** in the sidebar
3. Click **"New Key"**
4. Configure the key:
   - **Key Name**: `PixelGenesis Backend` (or any name you prefer)
   - **Admin**: Enable this for full access
   - **Expiration**: Set to "No expiration" or choose a date
5. Click **"Create"**
6. **Copy the JWT token** immediately (you won't be able to see it again!)

### 3. Update .env File

Open `backend/.env` and update:

```env
PIXELGENESIS_IPFS_PROVIDER=pinata
PIXELGENESIS_IPFS_API_URL=https://api.pinata.cloud
PIXELGENESIS_IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs
PIXELGENESIS_IPFS_API_TOKEN=your_jwt_token_here
```

Replace `your_jwt_token_here` with the JWT token you copied from Pinata.

### 4. Test the Setup

Once your backend is running, you can test IPFS uploads by:
- Issuing a credential (which will upload to IPFS)
- Checking the `storage_cid` field in the credential response

## Pinata Free Tier Limits

- **1 GB** storage
- **100,000** files
- **100 GB** bandwidth per month

For production, consider upgrading to a paid plan.

## Troubleshooting

### "Invalid JWT token" error
- Make sure you copied the full JWT token (it's a long string)
- Check that there are no extra spaces in the `.env` file
- Verify the token hasn't expired (if you set an expiration date)

### Upload fails
- Check your Pinata account limits (free tier has limits)
- Verify your internet connection
- In development mode, the service will use mock CIDs if upload fails

## Alternative: Switch to web3.storage

If you prefer web3.storage, update your `.env`:

```env
PIXELGENESIS_IPFS_PROVIDER=web3storage
PIXELGENESIS_IPFS_API_URL=https://api.web3.storage
PIXELGENESIS_IPFS_GATEWAY_URL=https://w3s.link/ipfs
PIXELGENESIS_IPFS_API_TOKEN=your_web3_storage_token
```

## More Information

- Pinata Documentation: https://docs.pinata.cloud/
- Pinata API Reference: https://docs.pinata.cloud/api-pinning/pin-file

