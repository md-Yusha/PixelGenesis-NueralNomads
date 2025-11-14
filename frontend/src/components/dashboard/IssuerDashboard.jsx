import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { getCredentialManagerContract, getCredentialManagerContractReadOnly } from '../../utils/web3'
import { formatAddress, formatDate } from '../../utils/helpers'
import { getIPFSFileUrl } from '../../utils/ipfs'
import { logActivity, ActivityType } from '../../utils/activityLogger'

const IssuerDashboard = ({ account }) => {
  const [issuedCredentials, setIssuedCredentials] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCredentials, setLoadingCredentials] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (account && account.startsWith('0x')) {
      loadIssuedCredentials()
    }
  }, [account])

  const loadIssuedCredentials = async () => {
    if (!account || !account.startsWith('0x')) {
      setLoadingCredentials(false)
      setIssuedCredentials([])
      return
    }

    setLoadingCredentials(true)
    try {
      const contract = getCredentialManagerContractReadOnly()
      const contractAddress = contract.target || contract.address
      console.log('Contract address:', contractAddress)
      
      if (!contractAddress || contractAddress === '0x') {
        console.warn('❌ Contract address not set!')
        console.warn('   Make sure contracts are deployed and contractAddresses.json is updated')
        setIssuedCredentials([])
        setLoadingCredentials(false)
        return
      }
      
      // Verify contract is deployed at this address
      try {
        const provider = contract.provider
        const code = await provider.getCode(contractAddress)
        if (code === '0x' || code === '0x0') {
          console.error('❌ No contract code found at address:', contractAddress)
          console.error('   The contract might not be deployed, or the address is wrong')
          setIssuedCredentials([])
          setLoadingCredentials(false)
          return
        } else {
          console.log('✅ Contract code found at address (length:', code.length, 'bytes)')
        }
      } catch (e) {
        console.warn('Could not verify contract code:', e.message)
      }

      let credentialIds = []
      
      // Normalize the account address
      const normalizedAccount = ethers.getAddress(account)
      console.log('Loading credentials issued by (normalized):', normalizedAccount)
      console.log('Original account:', account)
      
      // Strategy: Try to find credentials by querying with different address formats
      // The contract stores msg.sender, which might be in a different case format
      const addressVariants = [
        account, // Original format from MetaMask
        normalizedAccount, // Checksummed format
        account.toLowerCase(), // Lowercase
        ethers.getAddress(account.toLowerCase()) // Re-checksum after lowercasing
      ].filter((addr, index, self) => self.indexOf(addr) === index) // Remove duplicates
      
      console.log('Trying address variants:', addressVariants)
      
      // Try each address variant
      for (const addressVariant of addressVariants) {
        try {
          const result = await contract.getCredentialsByIssuer(addressVariant)
          
          // Check if we got a valid array with credentials
          if (result && Array.isArray(result) && result.length > 0) {
            credentialIds = result
            console.log(`✅ Found ${credentialIds.length} credential(s) with address: ${addressVariant}`)
            break
          } else if (result && Array.isArray(result) && result.length === 0) {
            // Empty array means no credentials for this address format
            console.log(`Empty array for ${addressVariant}, trying next...`)
            continue
          }
        } catch (callError) {
          // Handle decode errors (empty result)
          if (callError.message && (
            callError.message.includes('value="0x"') || 
            callError.message.includes('BAD_DATA') ||
            callError.message.includes('could not decode')
          )) {
            console.log(`Empty result (decode error) for ${addressVariant}, trying next...`)
            continue
          } else {
            console.log(`Error with ${addressVariant}:`, callError.message)
            continue
          }
        }
      }
      
      // If we still haven't found credentials, try querying events
      // This will find credentials regardless of address format issues
      if (!credentialIds || credentialIds.length === 0) {
        console.log('⚠️ No credentials found with direct query, trying event-based search...')
        
        try {
          const provider = contract.provider
          const contractAddress = contract.target || contract.address
          
          // Query CredentialIssued events filtered by issuer
          // Try filtering by issuer address directly (indexed parameter)
          const currentBlock = await provider.getBlockNumber()
          const fromBlock = Math.max(0, currentBlock - 10000)
          
          console.log(`Querying events from block ${fromBlock} to ${currentBlock}...`)
          
          // Try filtering with each address variant
          let matchingEvents = []
          for (const addressVariant of addressVariants) {
            try {
              const eventFilter = contract.filters.CredentialIssued(null, addressVariant, null)
              const events = await contract.queryFilter(eventFilter, fromBlock, currentBlock)
              
              if (events.length > 0) {
                console.log(`Found ${events.length} events with issuer: ${addressVariant}`)
                matchingEvents = events
                break
              }
            } catch (filterError) {
              console.log(`Error filtering events with ${addressVariant}:`, filterError.message)
              continue
            }
          }
          
          // If no events found with direct filter, try getting all events and filter manually
          if (matchingEvents.length === 0) {
            console.log('No events found with direct filter, trying all events...')
            const eventFilter = contract.filters.CredentialIssued(null, null, null)
            const allEvents = await contract.queryFilter(eventFilter, fromBlock, currentBlock)
            console.log(`Found ${allEvents.length} total CredentialIssued events`)
            
            // Filter events by issuer (case-insensitive comparison)
            const accountLower = account.toLowerCase()
            matchingEvents = allEvents.filter(event => {
              if (event.args && event.args.issuer) {
                const issuerLower = event.args.issuer.toLowerCase()
                return issuerLower === accountLower
              }
              return false
            })
          }
          
          console.log(`Found ${matchingEvents.length} events matching issuer address`)
          
          if (matchingEvents.length > 0) {
            // Extract credential IDs from events
            credentialIds = matchingEvents.map(event => event.args.credentialId)
            console.log(`✅ Found ${credentialIds.length} credential(s) via event query`)
            
            // Also log the actual issuer address from the event for debugging
            if (matchingEvents.length > 0) {
              console.log('Event issuer address:', matchingEvents[0].args.issuer)
              console.log('Your account address:', account)
            }
          } else {
            console.log('💡 No credentials found via events either')
            console.log('💡 If you just issued a credential, wait a moment and refresh')
            setIssuedCredentials([])
            setLoadingCredentials(false)
            return
          }
        } catch (eventError) {
          console.error('Error querying events:', eventError)
          console.log('💡 Tip: If you just issued a credential, the transaction succeeded')
          console.log('💡 But we cannot find it - this might be a contract/network issue')
          setIssuedCredentials([])
          setLoadingCredentials(false)
          return
        }
      }

      const credentialPromises = credentialIds.map(async (credentialId) => {
        try {
          const credential = await contract.getCredential(credentialId)
          return {
            credentialId: credentialId,
            issuer: credential.issuer,
            subject: credential.subject,
            ipfsHash: credential.ipfsHash,
            isRevoked: credential.isRevoked,
            issuedAt: new Date(Number(credential.issuedAt) * 1000),
            revokedAt: credential.revokedAt > 0 
              ? new Date(Number(credential.revokedAt) * 1000) 
              : null,
          }
        } catch (err) {
          return null
        }
      })

      const credentialData = await Promise.all(credentialPromises)
      const validCredentials = credentialData.filter(cred => cred !== null)
      console.log('Loaded issued credentials:', validCredentials.length, validCredentials)
      setIssuedCredentials(validCredentials)
    } catch (error) {
      console.error('Error loading issued credentials:', error)
      setIssuedCredentials([])
    } finally {
      setLoadingCredentials(false)
    }
  }

  const handleRevoke = async (credentialId) => {
    if (!window.confirm('Are you sure you want to revoke this credential?')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const contract = await getCredentialManagerContract()
      const tx = await contract.revokeCredential(credentialId)
      await tx.wait()

      // Log activity
      logActivity(account, ActivityType.CREDENTIAL_REVOKED, {
        credentialId,
      })

      setMessage({ 
        type: 'success', 
        text: `Credential revoked successfully! Transaction: ${tx.hash.substring(0, 20)}...` 
      })

      setTimeout(() => {
        loadIssuedCredentials()
      }, 2000)
    } catch (error) {
      console.error('Error revoking credential:', error)
      setMessage({ 
        type: 'error', 
        text: `Failed to revoke credential: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-3">
          <Shield size={32} className="text-neon-cyan" />
          Issuer Dashboard
        </h2>
        <p className="text-gray-400 mb-2">
          Manage credentials you have issued. You can revoke them if needed.
        </p>
        <p className="text-sm text-gray-500">
          Issued by: <span className="text-neon-cyan font-mono">{formatAddress(account)}</span>
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 ${
              message.type === 'error' 
                ? 'bg-neon-purple/20 border border-neon-purple/50 text-neon-purple'
                : 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {loadingCredentials ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse-neon text-neon-cyan">Loading credentials...</div>
        </div>
      ) : issuedCredentials.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 text-center"
        >
          <Shield size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-400 mb-2">No credentials issued yet</p>
          <p className="text-gray-500">
            Issue a credential using the "Issue Document" tab.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            {issuedCredentials.length} credential{issuedCredentials.length !== 1 ? 's' : ''} issued
          </div>
          {issuedCredentials.map((credential, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 ${
                credential.isRevoked ? 'opacity-60 border-neon-purple/50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {credential.isRevoked ? (
                      <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-sm font-medium flex items-center gap-2 border-2 border-neon-purple/50">
                        <X size={14} />
                        Revoked
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-sm font-medium flex items-center gap-2 border-2 border-neon-cyan/50">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Recipient:</span>{' '}
                      <span className="text-neon-cyan font-mono">{formatAddress(credential.subject)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Issued on:</span>{' '}
                      <span className="text-gray-300">{formatDate(credential.issuedAt)}</span>
                    </div>
                    {credential.revokedAt && (
                      <div>
                        <span className="text-gray-500">Revoked on:</span>{' '}
                        <span className="text-neon-purple">{formatDate(credential.revokedAt)}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">IPFS Hash:</span>{' '}
                      <span className="text-gray-400 font-mono text-xs break-all">{credential.ipfsHash}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      logActivity(account, ActivityType.DOCUMENT_VIEWED, {
                        documentName: `Credential ${credential.credentialId.substring(0, 8)}...`,
                        ipfsHash: credential.ipfsHash,
                        credentialId: credential.credentialId,
                      })
                      window.open(getIPFSFileUrl(credential.ipfsHash), '_blank')
                    }}
                    className="neon-button-secondary px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  {!credential.isRevoked && (
                    <button
                      onClick={() => handleRevoke(credential.credentialId)}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-neon-purple/20 text-neon-purple border-2 border-neon-purple/50 hover:bg-neon-purple/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <X size={16} />
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={loadIssuedCredentials}
          disabled={loadingCredentials}
          className="neon-button-secondary px-6 py-3 disabled:opacity-50"
        >
          {loadingCredentials ? 'Loading...' : 'Refresh'}
        </button>
        <div className="text-sm text-gray-500 flex items-center">
          <span>Connected as: </span>
          <span className="text-neon-cyan font-mono ml-2">{formatAddress(account)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default IssuerDashboard

