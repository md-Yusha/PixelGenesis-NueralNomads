# PixelLocker Mobile App

React Native mobile application for PixelLocker - A decentralized identity and document management system.

## Features

- 🔐 Wallet connection and management
- 📄 Document upload and management
- 🎫 Credential issuance (for issuers)
- 📱 QR code scanning for document sharing
- 🔑 DID (Decentralized Identifier) management
- 👥 Role-based access (Owner, Issuer, Verifier, User)
- 📤 IPFS integration for secure document storage

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for development)
- Android Studio (for Android APK build)
- Xcode (for iOS build, macOS only)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_PINATA_JWT=your_pinata_jwt_token
EXPO_PUBLIC_PINATA_API_KEY=your_pinata_api_key (optional)
EXPO_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret (optional)
EXPO_PUBLIC_OWNER_PRIVATE_KEY=your_owner_private_key (optional)
```

3. Update contract addresses in `src/config.js`:
```javascript
export const CONTRACT_ADDRESSES = {
  DIDRegistry: "0x...",
  CredentialManager: "0x...",
  RoleManager: "0x...",
  network: "localhost",
  chainId: 31337
};
```

## Running the App

### Development Mode

1. Start the Expo development server:
```bash
npm start
```

2. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens Expo Go)

### Android

```bash
npm run android
```

### iOS (macOS only)

```bash
npm run ios
```

## Building APK

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build APK:
```bash
npm run build:apk
```

### Using Expo Build (Legacy)

1. Build APK:
```bash
expo build:android -t apk
```

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── DIDManager.js
│   │       ├── HomeTab.js
│   │       ├── IssueDocument.js
│   │       ├── IssuerDashboard.js
│   │       ├── MyDocuments.js
│   │       ├── OwnerDashboard.js
│   │       ├── ScanDocument.js
│   │       ├── ShareCredentials.js
│   │       └── UploadDocuments.js
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   └── LandingScreen.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── ipfs.js
│   │   ├── roles.js
│   │   └── web3.js
│   └── config.js
├── App.js
├── app.json
└── package.json
```

## Key Technologies

- **React Native**: Mobile framework
- **Expo SDK 54**: Development platform
- **React Navigation**: Navigation library
- **Ethers.js v6**: Ethereum blockchain interaction
- **IPFS/Pinata**: Decentralized file storage
- **Expo Camera**: QR code scanning
- **AsyncStorage**: Local data persistence

## Wallet Connection

The app uses a simplified wallet connection approach for mobile:
- Generates a new wallet on first launch
- Stores wallet private key securely in AsyncStorage
- In production, consider integrating WalletConnect for better UX

## Network Configuration

By default, the app connects to a local Hardhat network. To connect to a different network:

1. Update `NETWORK_CONFIG` in `src/config.js`
2. Update contract addresses in `CONTRACT_ADDRESSES`

## Troubleshooting

### Camera Permission Issues
- Ensure camera permissions are granted in device settings
- For Android, check `app.json` permissions configuration

### IPFS Upload Failures
- Verify Pinata credentials in `.env` file
- Check network connectivity
- Ensure file size is within limits

### Contract Connection Issues
- Verify contract addresses are correct
- Ensure blockchain node is running and accessible
- Check network configuration matches deployed contracts

## License

This project is part of the PixelLocker ecosystem.

