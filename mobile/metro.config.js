// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle module resolution issues
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'js', 'jsx', 'json', 'ts', 'tsx'],
  unstable_enablePackageExports: true,
};

// Ensure node_modules are properly resolved
config.watchFolders = [__dirname];

module.exports = config;

