// Contract addresses - same as frontend
export const CONTRACT_ADDRESSES = {
  DIDRegistry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  CredentialManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  RoleManager: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  network: "localhost",
  chainId: 31337
};

// Owner private key from environment variable
// This should be set in .env file: EXPO_PUBLIC_OWNER_PRIVATE_KEY=your_private_key_here
export const OWNER_PRIVATE_KEY = process.env.EXPO_PUBLIC_OWNER_PRIVATE_KEY || '';

// IPFS Configuration - Using Pinata
export const IPFS_CONFIG = {
  pinataApiUrl: 'https://api.pinata.cloud',
  pinataJWT: process.env.EXPO_PUBLIC_PINATA_JWT || '',
  pinataApiKey: process.env.EXPO_PUBLIC_PINATA_API_KEY || '',
  pinataApiSecret: process.env.EXPO_PUBLIC_PINATA_API_SECRET || '',
  gatewayUrl: 'https://gateway.pinata.cloud/ipfs/',
  publicGatewayUrl: 'https://ipfs.io/ipfs/',
  usePinata: true,
};

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 1337, // Hardhat local network
  chainName: 'Hardhat Local',
  rpcUrl: 'http://127.0.0.1:8545',
};

