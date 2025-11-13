/**
 * Environment configuration for PixelGenesis
 * Reads PIXELGENESIS_* variables from import.meta.env
 * Must be consistent with backend and mobile naming
 */

export interface PixelGenesisConfig {
  env: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  webBaseUrl: string;
  chainId: number;
  rpcUrl: string;
  didRegistryContractAddress: `0x${string}`;
  vcRegistryContractAddress: `0x${string}`;
  ipfsApiUrl: string;
  ipfsGatewayUrl: string;
  ipfsApiToken?: string;
  didMethod: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const rawValue = import.meta.env[key];
  if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
    return rawValue;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Missing required environment variable: ${key}`);
}

function getChainId(): number {
  const value = getEnvVar('VITE_PIXELGENESIS_CHAIN_ID', '80001');
  const chainId = parseInt(value, 10);
  if (isNaN(chainId)) {
    throw new Error(`Invalid chain ID: ${value}`);
  }
  return chainId;
}

function getContractAddress(key: string, defaultValue = '0x0000000000000000000000000000000000000000'): `0x${string}` {
  const value = getEnvVar(key, defaultValue);
  if (!value.startsWith('0x') || value.length !== 42) {
    throw new Error(`Invalid contract address format: ${value}`);
  }
  return value as `0x${string}`;
}

function getEnv(): 'development' | 'staging' | 'production' {
  const env = getEnvVar('VITE_PIXELGENESIS_ENV', 'development');
  if (env !== 'development' && env !== 'staging' && env !== 'production') {
    throw new Error(`Invalid environment: ${env}. Must be development, staging, or production`);
  }
  return env as 'development' | 'staging' | 'production';
}

export const config: PixelGenesisConfig = {
  env: getEnv(),
  apiBaseUrl: getEnvVar('VITE_PIXELGENESIS_API_BASE_URL', 'http://localhost:8000'),
  webBaseUrl: getEnvVar('VITE_PIXELGENESIS_WEB_BASE_URL', 'http://localhost:3000'),
  chainId: getChainId(),
  rpcUrl: getEnvVar('VITE_PIXELGENESIS_RPC_URL', 'https://rpc-mumbai.maticvigil.com'),
  didRegistryContractAddress: getContractAddress(
    'VITE_PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS',
    '0x0000000000000000000000000000000000000000'
  ),
  vcRegistryContractAddress: getContractAddress(
    'VITE_PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS',
    '0x0000000000000000000000000000000000000000'
  ),
  ipfsApiUrl: getEnvVar('VITE_PIXELGENESIS_IPFS_API_URL', 'https://api.web3.storage'),
  ipfsGatewayUrl: getEnvVar('VITE_PIXELGENESIS_IPFS_GATEWAY_URL', 'https://w3s.link/ipfs/'),
  ipfsApiToken: getEnvVar('VITE_PIXELGENESIS_IPFS_API_TOKEN', '').trim() || undefined,
  didMethod: getEnvVar('VITE_PIXELGENESIS_DID_METHOD', 'did:example'),
};

export default config;

