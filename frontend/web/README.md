# PixelGenesis Web dApp

A React-based decentralized application (dApp) for the PixelGenesis identity and verifiable credentials platform. This frontend application provides user interfaces for Holders, Issuers, and Verifiers to interact with the PixelGenesis backend and blockchain contracts.

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **wagmi** + **viem** - Ethereum wallet integration
- **RainbowKit** - Wallet connection UI
- **TailwindCSS** - Styling
- **Axios** - HTTP client

## Project Structure

```
frontend/web/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loader.tsx
│   │   └── layout/          # Layout components
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── routes/
│   │   ├── Home.tsx
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Holder/
│   │   │   ├── Dashboard.tsx
│   │   │   └── MyCredentials.tsx
│   │   ├── Issuer/
│   │   │   ├── Dashboard.tsx
│   │   │   └── IssueCredential.tsx
│   │   └── Verifier/
│   │       └── VerifyCredential.tsx
│   ├── lib/
│   │   ├── apiClient.ts     # Backend API client
│   │   ├── web3Client.ts    # Web3/wagmi configuration
│   │   └── types.ts         # TypeScript type definitions
│   ├── config/
│   │   └── env.ts           # Environment configuration
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # App entry point with providers
│   └── index.css            # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A running PixelGenesis backend (FastAPI)
- Access to an Ethereum network (local or testnet)
- MetaMask or another Web3 wallet browser extension

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd frontend/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set the following variables:
   ```env
   # Backend API URL
   VITE_PIXELGENESIS_API_BASE_URL=http://localhost:8000
   
   # Blockchain configuration
   VITE_PIXELGENESIS_CHAIN_ID=31337
   VITE_PIXELGENESIS_RPC_URL=http://localhost:8545
   
   # Contract addresses (from your deployed contracts)
   VITE_PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS=0x...
   VITE_PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS=0x...
   
   # IPFS gateway
   VITE_PIXELGENESIS_IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
   
   # WalletConnect project ID (optional, for production)
   VITE_WALLET_CONNECT_PROJECT_ID=your-project-id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The app will be available at `http://localhost:3000` (or the port shown in the terminal).

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production build will be in the `dist/` directory.

## Features

### Authentication
- User registration with role selection (Holder, Issuer, Verifier)
- JWT-based authentication
- Token stored in localStorage and automatically attached to API requests

### Wallet Integration
- Connect MetaMask or other Web3 wallets via RainbowKit
- Network validation (warns if wrong chain)
- Display connected wallet address in navbar

### Holder Features
- **Dashboard**: View DID information, generate DID if needed
- **My Credentials**: List all received credentials with:
  - Status indicators (Active, Revoked, Expired, Suspended)
  - Transaction hashes with explorer links
  - IPFS links for credential data
  - View full VC JSON in modal

### Issuer Features
- **Dashboard**: View issuer DID and statistics
- **Issue Credential**: Form to issue new credentials with:
  - Holder DID input
  - Credential type selection
  - Dynamic claims (key-value pairs)
  - Optional expiration date
  - Transaction hash display after issuance

### Verifier Features
- **Verify Credential**: Multiple input methods:
  - Paste full VC JSON
  - Enter VC hash
  - Enter VC ID
- Display verification results:
  - Valid/Invalid status
  - On-chain status
  - Expiry status
  - Detailed reasons
  - IPFS links if available

## API Integration

The app communicates with the PixelGenesis FastAPI backend using the `apiClient` module. All API calls include JWT authentication tokens when available.

### Endpoints Used:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/did/me` - Get current user's DID
- `POST /api/v1/did` - Create new DID
- `GET /api/v1/credentials/me` - Get user's credentials
- `POST /api/v1/credentials/issue` - Issue new credential
- `POST /api/v1/credentials/verify` - Verify credential

## Web3 Integration

The app uses `wagmi` and `viem` for blockchain interactions:

- Wallet connection via RainbowKit
- Chain configuration from environment variables
- Contract addresses for DID and VC registries
- Ready for contract interactions (extend `web3Client.ts` as needed)

## Development Notes

- **Type Safety**: All API responses and types are defined in `lib/types.ts`
- **Error Handling**: API errors are handled in the `apiClient` interceptors
- **State Management**: React Query handles server state; minimal React context for auth
- **Routing**: Protected routes require authentication token
- **Styling**: TailwindCSS with custom primary color scheme

## Troubleshooting

1. **CORS Errors**: Ensure the backend allows requests from `http://localhost:3000`
2. **Wallet Connection Issues**: Make sure MetaMask is installed and unlocked
3. **Wrong Chain**: The app will warn if connected to the wrong network; switch in MetaMask
4. **API Errors**: Check that the backend is running and `VITE_PIXELGENESIS_API_BASE_URL` is correct
5. **Build Errors**: Ensure all environment variables are set in `.env`

## Next Steps

- Add contract interaction hooks for on-chain operations
- Implement credential sharing/QR code generation
- Add credential revocation UI for issuers
- Enhance error messages and loading states
- Add unit and integration tests
- Implement credential filtering and search

