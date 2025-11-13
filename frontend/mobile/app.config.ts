import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'PixelGenesis',
  slug: 'pixelgenesis-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  // Assets are optional - Expo will use defaults if not provided
  // icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    // image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#007AFF',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pixelgenesis.mobile',
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: './assets/adaptive-icon.png',
    //   backgroundColor: '#ffffff',
    // },
    package: 'com.pixelgenesis.mobile',
    permissions: ['CAMERA'],
  },
  web: {
    // favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-barcode-scanner',
      {
        cameraPermission: 'Allow PixelGenesis to access your camera to scan QR codes.',
      },
    ],
  ],
  extra: {
    PIXELGENESIS_ENV: process.env.PIXELGENESIS_ENV || 'development',
    PIXELGENESIS_API_BASE_URL: process.env.PIXELGENESIS_API_BASE_URL || 'http://localhost:8000',
    PIXELGENESIS_WEB_BASE_URL: process.env.PIXELGENESIS_WEB_BASE_URL || 'http://localhost:3000',
    PIXELGENESIS_MOBILE_DEEPLINK_SCHEME: process.env.PIXELGENESIS_MOBILE_DEEPLINK_SCHEME || 'pixelgenesis',
    PIXELGENESIS_CHAIN_ID: process.env.PIXELGENESIS_CHAIN_ID || '80001',
    PIXELGENESIS_RPC_URL: process.env.PIXELGENESIS_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS: process.env.PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS || '0xDID_REGISTRY_PLACEHOLDER',
    PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS: process.env.PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS || '0xVC_REGISTRY_PLACEHOLDER',
    PIXELGENESIS_IPFS_API_URL: process.env.PIXELGENESIS_IPFS_API_URL || 'https://api.web3.storage',
    PIXELGENESIS_IPFS_GATEWAY_URL: process.env.PIXELGENESIS_IPFS_GATEWAY_URL || 'https://w3s.link/ipfs',
    PIXELGENESIS_IPFS_API_TOKEN: process.env.PIXELGENESIS_IPFS_API_TOKEN || '',
    PIXELGENESIS_DID_METHOD: process.env.PIXELGENESIS_DID_METHOD || 'did:example',
  },
});

