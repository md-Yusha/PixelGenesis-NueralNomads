# PixelGenesis Mobile App

A React Native + Expo mobile application for the PixelGenesis decentralized identity platform. This app enables users to manage their decentralized identifiers (DIDs), view verifiable credentials, and verify credentials as a verifier.

## Features

### Holder Flows
- **Authentication**: Login with email and password
- **DID Management**: View and generate decentralized identifiers
- **Credential Viewing**: Browse all verifiable credentials associated with your DID
- **Credential Details**: View full credential information including claims, proof, and access IPFS documents

### Verifier Flows
- **Credential Verification**: Verify credentials by pasting JSON or hash
- **QR Code Scanning**: Scan QR codes containing credential data or hashes
- **Verification Results**: View detailed verification results with reasons

## Tech Stack

- **React Native** (Expo managed workflow)
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **TanStack Query** (React Query) for data fetching
- **Axios** for API communication
- **Expo Barcode Scanner** for QR code scanning
- **Expo Secure Store** for token storage

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- Physical device with Expo Go app (optional, for testing)

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend/mobile
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the `frontend/mobile` directory (or configure in `app.config.ts`):
   ```env
   PIXELGENESIS_ENV=development
   PIXELGENESIS_API_BASE_URL=http://localhost:8000
   PIXELGENESIS_WEB_BASE_URL=http://localhost:3000
   PIXELGENESIS_MOBILE_DEEPLINK_SCHEME=pixelgenesis
   PIXELGENESIS_CHAIN_ID=80001
   PIXELGENESIS_RPC_URL=https://rpc-mumbai.maticvigil.com
   PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS=0xDID_REGISTRY_PLACEHOLDER
   PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS=0xVC_REGISTRY_PLACEHOLDER
   PIXELGENESIS_IPFS_API_URL=https://api.web3.storage
   PIXELGENESIS_IPFS_GATEWAY_URL=https://w3s.link/ipfs
   PIXELGENESIS_IPFS_API_TOKEN=YOUR_WEB3_STORAGE_TOKEN
   PIXELGENESIS_DID_METHOD=did:example
   ```

   Alternatively, you can set these in `app.config.ts` under the `extra` field.

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on a platform:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
frontend/mobile/
├── App.tsx                 # Main app entry point with providers
├── app.config.ts           # Expo configuration
├── package.json
├── tsconfig.json
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx    # Root navigation container
│   │   ├── AuthStack.tsx         # Authentication stack
│   │   └── MainTabs.tsx          # Main tab navigation
│   ├── screens/
│   │   ├── Auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── Holder/
│   │   │   ├── HolderHomeScreen.tsx
│   │   │   ├── MyCredentialsScreen.tsx
│   │   │   └── CredentialDetailScreen.tsx
│   │   └── Verifier/
│   │       ├── VerifyCredentialScreen.tsx
│   │       └── ScanQrScreen.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ScreenContainer.tsx
│   ├── lib/
│   │   ├── apiClient.ts           # Axios instance with auth
│   │   ├── types.ts               # Shared TypeScript types
│   │   ├── authStore.ts           # Auth context/store
│   │   └── useWallet.ts           # WalletConnect scaffolding
│   └── config/
│       └── env.ts                  # Environment configuration
└── README.md
```

## API Integration

The app communicates with the FastAPI backend at `PIXELGENESIS_API_BASE_URL`. All API calls use the `/api/v1/` prefix.

### Endpoints Used

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/did/me` - Get current user's DID
- `POST /api/v1/did` - Create a new DID
- `GET /api/v1/credentials/me` - Get user's credentials
- `POST /api/v1/credentials/verify` - Verify a credential

All authenticated requests include a JWT token in the `Authorization` header, stored securely using Expo Secure Store.

## Navigation Flow

1. **Unauthenticated**: Shows `AuthStack` with `LoginScreen`
2. **Authenticated**: Shows `MainTabs` with:
   - **Home Tab**: Holder home screen with DID info
   - **Credentials Tab**: List of user's credentials
   - **Verify Tab**: Credential verification screen

Additional screens accessible via navigation:
- `CredentialDetailScreen` - Full credential details
- `ScanQrScreen` - QR code scanner

## WalletConnect Integration

The app includes scaffolding for WalletConnect v2 integration in `src/lib/useWallet.ts`. Currently, it's a placeholder that returns `isConnected: false`. To implement:

1. Install WalletConnect v2 SDK packages
2. Initialize WalletConnect client
3. Implement connection and signing methods
4. Update `useWallet` hook with real implementation

## Development Notes

### Type Safety
All types are defined in `src/lib/types.ts` and match the shared PixelGenesis schema:
- `VerifiableCredential`
- `DIDDocument`
- `UserRole` enum
- `CredentialStatus` enum

### State Management
- **Auth**: React Context (`AuthProvider`)
- **Data Fetching**: TanStack Query (React Query)
- **Token Storage**: Expo Secure Store

### Styling
Components use React Native StyleSheet with a consistent design system:
- Primary color: `#007AFF`
- Success color: `#34C759`
- Error color: `#FF3B30`
- Card-based UI with shadows

## Troubleshooting

### Camera Permission Issues
If QR scanning doesn't work, ensure camera permissions are granted in device settings.

### API Connection Issues
- Verify `PIXELGENESIS_API_BASE_URL` is correct
- Ensure backend is running
- Check network connectivity
- Verify JWT token is being stored correctly

### Build Issues
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## Future Enhancements

- [ ] Full WalletConnect v2 integration
- [ ] Biometric authentication
- [ ] Push notifications for credential updates
- [ ] Offline credential caching
- [ ] Credential sharing via deep links
- [ ] Multi-wallet support
- [ ] Dark mode support

## License

Part of the PixelGenesis project.

