# Fix Module Resolution Errors

## Error: "Unable to resolve module react-native-screens"

### Solution 1: Clear All Caches and Restart
```bash
cd mobile

# Stop any running Metro bundler (Ctrl+C)

# Clear all caches
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*

# Restart with cleared cache
npx expo start --clear
```

### Solution 2: Reinstall Native Dependencies
```bash
cd mobile

# Reinstall React Navigation dependencies
npx expo install react-native-screens react-native-safe-area-context

# Clear cache and restart
npx expo start --clear
```

### Solution 3: Full Clean Reinstall
```bash
cd mobile

# Remove node_modules and caches
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache

# Reinstall
npm install

# Install Expo-compatible versions
npx expo install --fix

# Start with cleared cache
npx expo start --clear
```

### Solution 4: Check Metro Config
Make sure `metro.config.js` exists and has proper configuration (already created).

### Solution 5: For Development Build (if using EAS)
If you're building a development build, you may need to:
```bash
npx expo prebuild
```

But for Expo Go, this is not necessary.

## Common Causes
1. Metro bundler cache corruption
2. Node modules not properly installed
3. Version mismatch between packages
4. Missing native module dependencies

## Verification
After fixing, verify the module exists:
```bash
ls node_modules/react-native-screens
```

If it exists, the issue is likely cache-related. Use Solution 1.

