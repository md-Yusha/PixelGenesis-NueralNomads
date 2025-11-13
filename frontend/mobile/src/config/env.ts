// Lazy load expo-constants to avoid native module issues at startup
let Constants: any = null;

const getConstants = () => {
  if (Constants !== null) {
    return Constants;
  }
  
  try {
    // Try to require expo-constants lazily
    const expoConstants = require('expo-constants');
    Constants = expoConstants.default || expoConstants;
    return Constants;
  } catch (e) {
    // If expo-constants fails, return a safe fallback
    Constants = { expoConfig: { extra: {} } };
    return Constants;
  }
};

// Helper to safely get config values
const getConfigValue = (key: string, defaultValue: string): string => {
  try {
    const constants = getConstants();
    const value = constants?.expoConfig?.extra?.[key];
    if (value) return value;
    
    // Fallback to process.env if available (for development)
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
    
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Create config object with lazy evaluation
const createConfig = () => ({
  PIXELGENESIS_ENV: getConfigValue('PIXELGENESIS_ENV', 'development'),
  PIXELGENESIS_API_BASE_URL: getConfigValue('PIXELGENESIS_API_BASE_URL', 'http://localhost:8000'),
  PIXELGENESIS_WEB_BASE_URL: getConfigValue('PIXELGENESIS_WEB_BASE_URL', 'http://localhost:3000'),
  PIXELGENESIS_MOBILE_DEEPLINK_SCHEME: getConfigValue('PIXELGENESIS_MOBILE_DEEPLINK_SCHEME', 'pixelgenesis'),
  PIXELGENESIS_CHAIN_ID: getConfigValue('PIXELGENESIS_CHAIN_ID', '80001'),
  PIXELGENESIS_RPC_URL: getConfigValue('PIXELGENESIS_RPC_URL', 'https://rpc-mumbai.maticvigil.com'),
  PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS: getConfigValue('PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS', '0xDID_REGISTRY_PLACEHOLDER'),
  PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS: getConfigValue('PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS', '0xVC_REGISTRY_PLACEHOLDER'),
  PIXELGENESIS_IPFS_API_URL: getConfigValue('PIXELGENESIS_IPFS_API_URL', 'https://api.web3.storage'),
  PIXELGENESIS_IPFS_GATEWAY_URL: getConfigValue('PIXELGENESIS_IPFS_GATEWAY_URL', 'https://w3s.link/ipfs'),
  PIXELGENESIS_IPFS_API_TOKEN: getConfigValue('PIXELGENESIS_IPFS_API_TOKEN', ''),
  PIXELGENESIS_DID_METHOD: getConfigValue('PIXELGENESIS_DID_METHOD', 'did:example'),
});

let _config: ReturnType<typeof createConfig> | null = null;

export const config = new Proxy({} as ReturnType<typeof createConfig>, {
  get(target, prop) {
    if (!_config) {
      _config = createConfig();
    }
    return _config[prop as keyof typeof _config];
  },
});

