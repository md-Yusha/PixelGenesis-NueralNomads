# Clear Metro Bundler Cache - Fix "Html5Qrcode.scanFile" Error

If you're still seeing the error "Html5Qrcode.scanFile is not a function", the old code is cached. Follow these steps:

## Step 1: Stop Metro Bundler
Press `Ctrl+C` in the terminal where Metro bundler is running.

## Step 2: Clear All Caches
Run these commands in PowerShell:

```powershell
cd mobile

# Remove Expo cache
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Remove Metro cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Remove watchman cache (if installed)
watchman watch-del-all 2>$null
```

## Step 3: Restart with Cleared Cache
```powershell
npx expo start --clear
```

## Step 4: If Still Not Working
Try a full clean:

```powershell
cd mobile

# Remove all caches and temp files
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\haste-* -ErrorAction SilentlyContinue

# Restart
npx expo start --clear --reset-cache
```

## Alternative: Full Reinstall
If nothing works:

```powershell
cd mobile

# Remove node_modules and caches
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Reinstall
npm install

# Start fresh
npx expo start --clear
```

## Verify Fix
After clearing cache, the error should be gone. The QR scanner now uses:
- `expo-camera`'s `CameraView` with `onBarcodeScanned` (no Html5Qrcode)
- Camera size is now 75% of screen height (much larger)
- Scan frame overlay for better UX

