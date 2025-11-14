import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, OWNER_PRIVATE_KEY } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ABI for DIDRegistry contract
const DID_REGISTRY_ABI = [
  "function registerDID(string memory did) public",
  "function updateDID(string memory newDid) public",
  "function getDID(address user) public view returns (string memory)",
  "function hasDID(address user) public view returns (bool)",
  "event DIDRegistered(address indexed owner, string did)",
  "event DIDUpdated(address indexed owner, string newDid)"
];

// ABI for CredentialManager contract
const CREDENTIAL_MANAGER_ABI = [
  "function issueCredential(address subject, string memory ipfsHash, bytes32 credentialId) public",
  "function revokeCredential(bytes32 credentialId) public",
  "function getCredential(bytes32 credentialId) public view returns (address issuer, address subject, string memory ipfsHash, bool isRevoked, uint256 issuedAt, uint256 revokedAt)",
  "function getCredentialsBySubject(address subject) public view returns (bytes32[] memory)",
  "function getCredentialsByIssuer(address issuer) public view returns (bytes32[] memory)",
  "function getTotalCredentials() public view returns (uint256)",
  "function verifyCredential(bytes32 credentialId) public view returns (bool)",
  "event CredentialIssued(bytes32 indexed credentialId, address indexed issuer, address indexed subject, string ipfsHash, uint256 timestamp)",
  "event CredentialRevoked(bytes32 indexed credentialId, address indexed issuer, uint256 timestamp)"
];

// ABI for RoleManager contract
const ROLE_MANAGER_ABI = [
  "function owner() public view returns (address)",
  "function issuers(address) public view returns (bool)",
  "function verifiers(address) public view returns (bool)",
  "function addIssuer(address issuerAddress) public",
  "function removeIssuer(address issuerAddress) public",
  "function addVerifier(address verifierAddress) public",
  "function removeVerifier(address verifierAddress) public",
  "function getUserRole(address userAddress) public view returns (bool isOwner, bool isIssuer, bool isVerifier)",
  "function getRole(address userAddress) public view returns (string memory)",
  "event IssuerAdded(address indexed issuer)",
  "event VerifierAdded(address indexed verifier)",
  "event IssuerRemoved(address indexed issuer)",
  "event VerifierRemoved(address indexed verifier)"
];

// Store for provider and signer
let provider = null;
let signer = null;
let account = null;

/**
 * Initialize provider with JSON RPC
 */
export const initializeProvider = () => {
  try {
    provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
    return provider;
  } catch (error) {
    console.error('Error initializing provider:', error);
    throw new Error(`Failed to initialize provider: ${error.message}`);
  }
};

/**
 * Get provider instance
 */
export const getProvider = () => {
  if (!provider) {
    provider = initializeProvider();
  }
  return provider;
};

/**
 * Connect wallet - supports both MetaMask and local wallet
 */
export const connectWallet = async (useMetaMask = false) => {
  try {
    if (useMetaMask) {
      // Check if we already have a MetaMask connection
      const walletType = await AsyncStorage.getItem('wallet_type');
      const storedAddress = await AsyncStorage.getItem('wallet_address');
      
      if (walletType === 'metamask' && storedAddress) {
        account = storedAddress;
        return account;
      }
      
      // Import MetaMask connection
      const { connectMetaMask } = require('./metamask');
      await connectMetaMask();
      // Will be set via deep link callback
      return null;
    }

    // Check if we have a stored wallet
    const storedKey = await AsyncStorage.getItem('wallet_private_key');
    if (storedKey) {
      const provider = getProvider();
      signer = new ethers.Wallet(storedKey, provider);
      account = signer.address;
      return account;
    }

    // Generate new wallet if none exists
    const wallet = ethers.Wallet.createRandom();
    const newPrivateKey = wallet.privateKey;
    const provider = getProvider();
    signer = new ethers.Wallet(newPrivateKey, provider);
    account = signer.address;
    await AsyncStorage.setItem('wallet_private_key', newPrivateKey);
    await AsyncStorage.setItem('wallet_address', account);
    await AsyncStorage.setItem('wallet_type', 'local');
    return account;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

/**
 * Get the current connected account
 */
export const getCurrentAccount = async () => {
  if (account) {
    return account;
  }
  
  try {
    const storedAddress = await AsyncStorage.getItem('wallet_address');
    if (storedAddress) {
      account = storedAddress;
      return account;
    }
    return null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

/**
 * Get signer instance
 */
export const getSigner = async () => {
  if (!signer) {
    const storedKey = await AsyncStorage.getItem('wallet_private_key');
    if (storedKey) {
      const provider = getProvider();
      signer = new ethers.Wallet(storedKey, provider);
      account = signer.address;
    } else {
      throw new Error('No wallet connected. Please connect a wallet first.');
    }
  }
  return signer;
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = async () => {
  signer = null;
  account = null;
  await AsyncStorage.removeItem('wallet_private_key');
  await AsyncStorage.removeItem('wallet_address');
};

/**
 * Get DIDRegistry contract instance
 */
export const getDIDRegistryContract = async () => {
  if (!CONTRACT_ADDRESSES.DIDRegistry) {
    throw new Error('DIDRegistry contract address not set. Please deploy contracts first.');
  }
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.DIDRegistry,
    DID_REGISTRY_ABI,
    signer
  );
};

/**
 * Get CredentialManager contract instance
 */
export const getCredentialManagerContract = async () => {
  if (!CONTRACT_ADDRESSES.CredentialManager) {
    throw new Error('CredentialManager contract address not set. Please deploy contracts first.');
  }
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.CredentialManager,
    CREDENTIAL_MANAGER_ABI,
    signer
  );
};

/**
 * Get DIDRegistry contract instance (read-only)
 */
export const getDIDRegistryContractReadOnly = () => {
  if (!CONTRACT_ADDRESSES.DIDRegistry) {
    throw new Error('DIDRegistry contract address not set. Please deploy contracts first.');
  }
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.DIDRegistry,
    DID_REGISTRY_ABI,
    provider
  );
};

/**
 * Get CredentialManager contract instance (read-only)
 */
export const getCredentialManagerContractReadOnly = () => {
  if (!CONTRACT_ADDRESSES.CredentialManager) {
    throw new Error('CredentialManager contract address not set. Please deploy contracts first.');
  }
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.CredentialManager,
    CREDENTIAL_MANAGER_ABI,
    provider
  );
};

/**
 * Get RoleManager contract instance
 */
export const getRoleManagerContract = async () => {
  if (!CONTRACT_ADDRESSES.RoleManager) {
    throw new Error('RoleManager contract address not set. Please deploy contracts first.');
  }
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.RoleManager,
    ROLE_MANAGER_ABI,
    signer
  );
};

/**
 * Get RoleManager contract instance (read-only)
 */
export const getRoleManagerContractReadOnly = () => {
  if (!CONTRACT_ADDRESSES.RoleManager) {
    console.warn('RoleManager contract address not set in config');
    return null;
  }
  
  try {
    const provider = getProvider();
    if (!provider) {
      console.warn('Provider not available');
      return null;
    }
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.RoleManager,
      ROLE_MANAGER_ABI,
      provider
    );
    
    return contract;
  } catch (error) {
    console.warn('Failed to create RoleManager contract:', error.message);
    return null;
  }
};

/**
 * Get owner wallet from private key (for owner login)
 */
export const getOwnerWallet = () => {
  if (!OWNER_PRIVATE_KEY) {
    return null;
  }
  try {
    const provider = getProvider();
    return new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
  } catch (error) {
    console.error('Error creating owner wallet:', error);
    return null;
  }
};

