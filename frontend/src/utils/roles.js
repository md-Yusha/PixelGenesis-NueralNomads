import { ethers } from 'ethers'
import { getRoleManagerContractReadOnly } from './web3'
import { OWNER_PRIVATE_KEY } from '../config'

/**
 * Get user role from contract
 * @param {string} accountAddress - The Ethereum address to check
 * @returns {Promise<string>} - Role: "owner", "issuer", "verifier", or "user"
 */
export const getUserRole = async (accountAddress) => {
  if (!accountAddress || !accountAddress.startsWith('0x')) {
    return 'user'
  }

  try {
    const contract = getRoleManagerContractReadOnly()
    
    if (!contract) {
      console.warn('RoleManager contract not available - MetaMask may not be connected')
      console.warn('Make sure MetaMask is connected and refresh the page')
      return 'user'
    }
    
    console.log('✅ Contract instance created successfully')

    // Check if contract address is set
    const contractAddress = contract.target || contract.address
    if (!contractAddress || contractAddress === '0x' || contractAddress === '') {
      console.warn('RoleManager contract address not set')
      return 'user'
    }

    // Verify contract code exists
    // In ethers v6, provider might be accessible via contract.provider or contract.runner.provider
    const provider = contract.provider || (contract.runner && contract.runner.provider)
    if (!provider) {
      console.warn('Provider not available on contract')
      console.warn('Contract object:', contract)
      console.warn('contract.provider:', contract.provider)
      console.warn('contract.runner:', contract.runner)
      return 'user'
    }

    try {
      const code = await provider.getCode(contractAddress)
      if (code === '0x' || code === '0x0') {
        console.warn('RoleManager contract not deployed at address:', contractAddress)
        return 'user'
      }
    } catch (codeError) {
      console.warn('Could not verify contract code:', codeError.message)
      // Continue anyway - might be a network issue
    }

    // Normalize address to ensure consistent checksum format
    const normalizedAddress = ethers.getAddress(accountAddress)
    
    // Check if address is owner
    try {
      const ownerAddress = await contract.owner()
      const normalizedOwner = ownerAddress ? ethers.getAddress(ownerAddress) : null
      console.log('🔍 Role check - Contract owner:', normalizedOwner)
      console.log('🔍 Role check - Your address:', normalizedAddress)
      console.log('🔍 Role check - Match:', normalizedOwner && normalizedOwner.toLowerCase() === normalizedAddress.toLowerCase())
      
      if (normalizedOwner && normalizedOwner.toLowerCase() === normalizedAddress.toLowerCase()) {
        console.log('✅ User is the contract owner!')
        return 'owner'
      }
    } catch (ownerError) {
      // If owner() fails, contract might not be deployed - continue to check other roles
      console.warn('Could not check owner:', ownerError.message)
    }
    
    // Check if address is issuer
    try {
      const isIssuer = await contract.issuers(normalizedAddress)
      if (isIssuer) {
        return 'issuer'
      }
    } catch (issuerError) {
      console.warn('Could not check issuer:', issuerError.message)
    }
    
    // Check if address is verifier
    try {
      const isVerifier = await contract.verifiers(normalizedAddress)
      if (isVerifier) {
        return 'verifier'
      }
    } catch (verifierError) {
      console.warn('Could not check verifier:', verifierError.message)
    }
    
    return 'user'
  } catch (error) {
    console.error('Error getting user role:', error)
    // If contract doesn't exist or isn't deployed, default to user
    if (error.message && (
      error.message.includes('contract address not set') ||
      error.message.includes('BAD_DATA') ||
      error.message.includes('could not decode')
    )) {
      console.warn('RoleManager contract not available, defaulting to user role')
      return 'user'
    }
    
    // Try alternative method using getRole function
    try {
      const contract = getRoleManagerContractReadOnly()
      if (!contract) {
        return 'user'
      }
      const normalizedAddress = ethers.getAddress(accountAddress)
      const role = await contract.getRole(normalizedAddress)
      return role
    } catch (fallbackError) {
      console.error('Error with fallback role check:', fallbackError)
      return 'user'
    }
  }
}

/**
 * Check if the connected account matches the owner private key
 * @param {string} accountAddress - The Ethereum address to check
 * @returns {boolean} - True if the address matches the owner private key
 */
export const isOwnerByPrivateKey = (accountAddress) => {
  if (!OWNER_PRIVATE_KEY || !accountAddress) {
    return false
  }

  try {
    // Check if it's actually a private key (64 hex chars) or an address (42 chars)
    const keyLength = OWNER_PRIVATE_KEY.replace('0x', '').length
    if (keyLength === 40 || keyLength === 42) {
      // This looks like an address, not a private key - skip this check
      console.warn('OWNER_PRIVATE_KEY appears to be an address, not a private key. Skipping private key check.')
      return false
    }

    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY)
    const ownerAddress = wallet.address.toLowerCase()
    return accountAddress.toLowerCase() === ownerAddress
  } catch (error) {
    // Invalid private key format - skip this check and rely on contract
    console.warn('Invalid private key format, skipping private key check:', error.message)
    return false
  }
}

/**
 * Get the owner address from private key
 * @returns {string|null} - Owner address or null if private key not set
 */
export const getOwnerAddress = () => {
  if (!OWNER_PRIVATE_KEY) {
    return null
  }

  try {
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY)
    return wallet.address
  } catch (error) {
    console.error('Error getting owner address:', error)
    return null
  }
}

/**
 * Determine user role considering both contract role and private key match
 * @param {string} accountAddress - The Ethereum address to check
 * @returns {Promise<string>} - Role: "owner", "issuer", "verifier", or "user"
 */
export const determineUserRole = async (accountAddress) => {
  if (!accountAddress || !accountAddress.startsWith('0x')) {
    console.log('🔍 Role check - Invalid address:', accountAddress)
    return 'user'
  }

  // Normalize address for consistent comparison
  const normalizedAddress = ethers.getAddress(accountAddress)
  console.log('🔍 Determining role for:', normalizedAddress)
  
  // First check if it matches owner private key
  const isPrivateKeyOwner = isOwnerByPrivateKey(normalizedAddress)
  console.log('🔍 Private key match:', isPrivateKeyOwner)
  if (isPrivateKeyOwner) {
    console.log('✅ User matches owner private key - returning owner')
    return 'owner'
  }

  // Then check contract role (this will also check if they're owner in contract)
  console.log('🔍 Checking contract role...')
  const contractRole = await getUserRole(normalizedAddress)
  console.log('🔍 Contract role result:', contractRole)
  
  // If contract says they're owner, return owner (even if private key doesn't match)
  if (contractRole === 'owner') {
    console.log('✅ Contract confirms user is owner')
    return 'owner'
  }
  
  console.log('🔍 Final role:', contractRole)
  return contractRole
}

