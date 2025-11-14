# MetaMask Integration Setup

## Overview
The mobile app now supports MetaMask wallet connection via deep linking. Users can connect their MetaMask mobile wallet and be redirected back to the app.

## How It Works

1. **User taps "Connect with MetaMask"** on the landing screen
2. **App checks if MetaMask is installed** on the device
3. **Opens MetaMask** via deep link with connection request
4. **User approves** connection in MetaMask
5. **MetaMask redirects back** to PixelLocker app with account info
6. **App processes the callback** and logs the user in

## Deep Link Configuration

The app is configured to handle deep links with the scheme: `pixellocker://metamask`

### Android
- Intent filter configured in `app.json`
- Handles `pixellocker://metamask` URLs
- MetaMask can redirect back using this scheme

### iOS
- URL scheme: `pixellocker`
- Configured in `app.json`

## Testing

1. Install MetaMask mobile app on your device
2. Run the PixelLocker app
3. Tap "Connect with MetaMask"
4. Approve the connection in MetaMask
5. You should be redirected back to PixelLocker and logged in

## Fallback

If MetaMask is not installed or connection fails, users can use the "Use Local Wallet" option which creates a local wallet for testing.

## Notes

- For production, you may want to implement WalletConnect v2 for better compatibility
- The current implementation uses deep linking which works well with MetaMask mobile
- Transaction signing will require additional implementation (WalletConnect SDK recommended)

