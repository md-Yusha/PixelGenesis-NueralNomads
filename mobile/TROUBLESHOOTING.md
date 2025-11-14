# Troubleshooting Guide

## Expo Linking Error: "Unable to resolve ./validateURL"

If you see this error:
```
Unable to resolve "./validateURL" from "node_modules\expo-linking\build\Linking.js"
```

### Solution 1: Clear All Caches
```bash
cd mobile
# Clear Metro bundler cache
npx expo start --clear

# Or manually clear caches
rm -rf .expo
rm -rf node_modules/.cache
npm start -- --reset-cache
```

### Solution 2: Reinstall expo-linking
```bash
cd mobile
npm uninstall expo-linking
npx expo install expo-linking
```

### Solution 3: Reinstall All Expo Packages
```bash
cd mobile
npx expo install --fix
```

### Solution 4: Full Clean Reinstall
```bash
cd mobile
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

## Boolean Casting Error

If you see: `java.lang.String cannot be cast to java.lang.Boolean`

### Fixed Issues:
- ✅ Removed all `gap` properties from StyleSheet (not fully supported in RN 0.81.5)
- ✅ Fixed Tab.Navigator to use `component` prop instead of children
- ✅ Ensured all boolean props use actual boolean values

### If Error Persists:
1. Clear Metro cache: `npx expo start --clear`
2. Check the exact error location in stack trace
3. Verify no string values are passed to boolean props
4. Check if any native modules need updates

## Hardhat Connection Error

If you see: `Cannot connect to the network localhost`

### Solution:
Start the Hardhat node in a separate terminal:
```bash
npm run node
```

Keep this terminal running while using the app.

## MetaMask Connection Issues

### On Mobile:
1. Make sure MetaMask mobile app is installed
2. Tap "Connect with MetaMask" in PixelLocker
3. Approve connection in MetaMask
4. You'll be redirected back to PixelLocker

### If Connection Fails:
- Check if MetaMask is installed: The app will show an alert if not found
- Use "Use Local Wallet" as fallback for testing
- For production, implement WalletConnect v2 SDK

