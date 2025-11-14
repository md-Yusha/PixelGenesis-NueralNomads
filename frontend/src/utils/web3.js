import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, OWNER_PRIVATE_KEY } from '../config';

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

/**
 * Check if MetaMask is installed
 */
export const checkMetaMask = () => {
  if (typeof window.ethereum !== 'undefined') {
    return true;
  }
  return false;
};

/**
 * Request account access from MetaMask
 */
export const connectWallet = async () => {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetChainId = `0x${NETWORK_CONFIG.chainId.toString(16)}`;

    if (chainId !== targetChainId) {
      // Try to switch network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetChainId,
                chainName: NETWORK_CONFIG.chainName,
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: null, // No block explorer for local network
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }

    return accounts[0];
  } catch (error) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

/**
 * Get the current connected account
 */
export const getCurrentAccount = async () => {
  if (!checkMetaMask()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

/**
 * Get provider instance
 */
export const getProvider = () => {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed');
  }
  if (!window.ethereum) {
    throw new Error('MetaMask provider not available');
  }
  try {
    return new ethers.BrowserProvider(window.ethereum);
  } catch (error) {
    throw new Error(`Failed to create provider: ${error.message}`);
  }
};

/**
 * Get signer instance
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
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
 * Listen for account changes
 */
export const onAccountsChanged = (callback) => {
  if (!checkMetaMask()) {
    return;
  }

  window.ethereum.on('accountsChanged', (accounts) => {
    callback(accounts.length > 0 ? accounts[0] : null);
  });
};

/**
 * Listen for chain changes
 */
export const onChainChanged = (callback) => {
  if (!checkMetaMask()) {
    return;
  }

  window.ethereum.on('chainChanged', (chainId) => {
    callback(chainId);
  });
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
    console.warn('RoleManager contract address not set in contractAddresses.json');
    return null;
  }
  
  // Check if MetaMask is available and connected
  if (!checkMetaMask()) {
    console.warn('MetaMask is not installed');
    return null;
  }
  
  if (!window.ethereum) {
    console.warn('MetaMask provider not available');
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
    
    // Verify provider is attached and accessible
    // In ethers v6, provider might be accessible via contract.provider or contract.runner.provider
    const contractProvider = contract.provider || (contract.runner && contract.runner.provider);
    if (!contractProvider) {
      console.warn('Provider not attached to contract');
      console.warn('Contract object:', contract);
      console.warn('Provider object:', provider);
      return null;
    }
    
    // Verify provider has required methods
    if (typeof contractProvider.getBlockNumber !== 'function') {
      console.warn('Provider does not have required methods');
      return null;
    }
    
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
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
    return new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
  } catch (error) {
    console.error('Error creating owner wallet:', error);
    return null;
  }
};

