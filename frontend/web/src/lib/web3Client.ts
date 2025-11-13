/**
 * Web3 client configuration for PixelGenesis
 * Uses wagmi + viem for EVM interactions
 */

import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { config as pixelGenesisConfig } from '@/config/env';

// Create a custom chain if needed
const pixelGenesisChain = {
  id: pixelGenesisConfig.chainId,
  name: 'PixelGenesis Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [pixelGenesisConfig.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: pixelGenesisConfig.rpcUrl.replace('/rpc', '') || 'https://etherscan.io',
    },
  },
};

// Get project ID from environment or use a default
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'default-project-id';

export const wagmiConfig = getDefaultConfig({
  appName: 'PixelGenesis',
  projectId,
  chains: [pixelGenesisChain, mainnet, sepolia, localhost],
  ssr: false,
});

export const pixelGenesisChainId = pixelGenesisConfig.chainId;
export const didRegistryAddress = pixelGenesisConfig.didRegistryContractAddress;
export const vcRegistryAddress = pixelGenesisConfig.vcRegistryContractAddress;

