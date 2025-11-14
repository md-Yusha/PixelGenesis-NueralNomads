import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { getRoleManagerContract, getRoleManagerContractReadOnly, checkMetaMask } from '../../utils/web3'
import { formatAddress } from '../../utils/helpers'
import { logActivity, ActivityType } from '../../utils/activityLogger'

const OwnerDashboard = ({ account }) => {
  const [issuers, setIssuers] = useState([])
  const [verifiers, setVerifiers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [newIssuerAddress, setNewIssuerAddress] = useState('')
  const [newVerifierAddress, setNewVerifierAddress] = useState('')
  const [contractAvailable, setContractAvailable] = useState(true)
  const [contractOwner, setContractOwner] = useState(null)
  const [isContractOwner, setIsContractOwner] = useState(false)
  const [transferToAddress, setTransferToAddress] = useState('')
  const [showTransferOwnership, setShowTransferOwnership] = useState(false)

  useEffect(() => {
    loadRoles()
  }, [account])

  const loadRoles = async () => {
    if (!account || !account.startsWith('0x')) {
      setIssuers([])
      setVerifiers([])
      return
    }

    try {
      const contract = getRoleManagerContractReadOnly()
      
      if (!contract) {
        console.error('RoleManager contract not available')
        setIssuers([])
        setVerifiers([])
        return
      }

      // In ethers v6, provider might be accessible via contract.provider or contract.runner.provider
      const provider = contract.provider || (contract.runner && contract.runner.provider)
      if (!provider) {
        console.error('Provider not available on contract')
        setIssuers([])
        setVerifiers([])
        setContractAvailable(false)
        return
      }

      const currentBlock = await provider.getBlockNumber()
      const fromBlock = Math.max(0, currentBlock - 10000) // Last 10000 blocks

      console.log('Loading roles from events (blocks', fromBlock, 'to', currentBlock, ')')

      // Load issuers from events
      const issuerAddedFilter = contract.filters.IssuerAdded()
      const issuerRemovedFilter = contract.filters.IssuerRemoved()
      
      const [addedEvents, removedEvents] = await Promise.all([
        contract.queryFilter(issuerAddedFilter, fromBlock, currentBlock),
        contract.queryFilter(issuerRemovedFilter, fromBlock, currentBlock)
      ])

      console.log('Found', addedEvents.length, 'IssuerAdded events and', removedEvents.length, 'IssuerRemoved events')

      // Process issuer events
      const issuerSet = new Set()
      addedEvents.forEach(event => {
        if (event.args && event.args.issuer) {
          const addr = ethers.getAddress(event.args.issuer)
          issuerSet.add(addr)
          console.log('Issuer added event:', addr)
        }
      })
      removedEvents.forEach(event => {
        if (event.args && event.args.issuer) {
          const addr = ethers.getAddress(event.args.issuer)
          issuerSet.delete(addr)
          console.log('Issuer removed event:', addr)
        }
      })

      // Also verify by checking contract state directly for each issuer from events
      const verifiedIssuers = []
      for (const issuerAddr of issuerSet) {
        try {
          const isIssuer = await contract.issuers(issuerAddr)
          if (isIssuer) {
            verifiedIssuers.push(issuerAddr)
            console.log('Verified issuer on-chain:', issuerAddr)
          } else {
            console.warn('Issuer in events but not in contract state:', issuerAddr)
          }
        } catch (err) {
          console.error('Error verifying issuer', issuerAddr, ':', err)
        }
      }

      // Load verifiers from events
      const verifierAddedFilter = contract.filters.VerifierAdded()
      const verifierRemovedFilter = contract.filters.VerifierRemoved()
      
      const [verifierAddedEvents, verifierRemovedEvents] = await Promise.all([
        contract.queryFilter(verifierAddedFilter, fromBlock, currentBlock),
        contract.queryFilter(verifierRemovedFilter, fromBlock, currentBlock)
      ])

      console.log('Found', verifierAddedEvents.length, 'VerifierAdded events and', verifierRemovedEvents.length, 'VerifierRemoved events')

      // Process verifier events
      const verifierSet = new Set()
      verifierAddedEvents.forEach(event => {
        if (event.args && event.args.verifier) {
          const addr = ethers.getAddress(event.args.verifier)
          verifierSet.add(addr)
          console.log('Verifier added event:', addr)
        }
      })
      verifierRemovedEvents.forEach(event => {
        if (event.args && event.args.verifier) {
          const addr = ethers.getAddress(event.args.verifier)
          verifierSet.delete(addr)
          console.log('Verifier removed event:', addr)
        }
      })

      // Also verify by checking contract state directly for each verifier from events
      const verifiedVerifiers = []
      for (const verifierAddr of verifierSet) {
        try {
          const isVerifier = await contract.verifiers(verifierAddr)
          if (isVerifier) {
            verifiedVerifiers.push(verifierAddr)
            console.log('Verified verifier on-chain:', verifierAddr)
          } else {
            console.warn('Verifier in events but not in contract state:', verifierAddr)
          }
        } catch (err) {
          console.error('Error verifying verifier', verifierAddr, ':', err)
        }
      }

      setIssuers(verifiedIssuers)
      setVerifiers(verifiedVerifiers)
      setContractAvailable(true)
      
      // Check contract owner
      try {
        const ownerAddr = await contract.owner()
        const normalizedOwner = ethers.getAddress(ownerAddr)
        setContractOwner(normalizedOwner)
        
        const normalizedAccount = ethers.getAddress(account)
        setIsContractOwner(normalizedOwner.toLowerCase() === normalizedAccount.toLowerCase())
      } catch (err) {
        console.warn('Could not get contract owner:', err)
      }
      
      console.log('Loaded', verifiedIssuers.length, 'issuers and', verifiedVerifiers.length, 'verifiers')
    } catch (error) {
      console.error('Error loading roles:', error)
      setIssuers([])
      setVerifiers([])
      
      // Check if it's a contract availability issue
      if (error.message && (
        error.message.includes('contract address not set') ||
        error.message.includes('not available') ||
        error.message.includes('not deployed')
      )) {
        setContractAvailable(false)
      }
    }
  }

  const handleAddIssuer = async () => {
    if (!newIssuerAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter an issuer address' })
      return
    }

    if (!ethers.isAddress(newIssuerAddress.trim())) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // First check if MetaMask is connected
      if (!checkMetaMask()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.')
      }

      // Verify contract is accessible
      const readOnlyContract = getRoleManagerContractReadOnly()
      
      if (!readOnlyContract) {
        throw new Error('RoleManager contract not available. Please deploy contracts first.')
      }

      const contractAddress = readOnlyContract.target || readOnlyContract.address
      
      if (!contractAddress || contractAddress === '0x' || contractAddress === '') {
        throw new Error('RoleManager contract address not set. Please deploy contracts first.')
      }

      // Verify contract code exists
      // In ethers v6, provider might be accessible via contract.provider or contract.runner.provider
      const provider = readOnlyContract.provider || (readOnlyContract.runner && readOnlyContract.runner.provider)
      
      if (!provider) {
        throw new Error('Provider not available. Please make sure MetaMask is connected and refresh the page.')
      }

      const code = await provider.getCode(contractAddress)
      if (code === '0x' || code === '0x0') {
        throw new Error('RoleManager contract not deployed at this address. Please deploy contracts.')
      }

      // Verify user is owner
      const ownerAddress = await readOnlyContract.owner()
      const normalizedAccount = ethers.getAddress(account)
      const normalizedOwner = ethers.getAddress(ownerAddress)
      
      if (normalizedOwner.toLowerCase() !== normalizedAccount.toLowerCase()) {
        throw new Error(
          `Only the contract owner can add issuers.\n` +
          `Contract owner: ${formatAddress(normalizedOwner)}\n` +
          `Your address: ${formatAddress(normalizedAccount)}\n` +
          `Please connect with the owner account or transfer ownership first.`
        )
      }

      const contract = await getRoleManagerContract()
      const normalizedAddress = ethers.getAddress(newIssuerAddress.trim())
      
      console.log('Adding issuer:', normalizedAddress)
      console.log('Contract address:', contractAddress)
      console.log('Owner address:', ownerAddress)
      console.log('Your address:', normalizedAccount)
      
      const tx = await contract.addIssuer(normalizedAddress)
      console.log('Transaction sent:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt.status)
      
      if (receipt.status !== 1) {
        throw new Error('Transaction failed')
      }

      // Verify the issuer was actually saved by reading from contract
      let verified = false
      
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms between retries
        try {
          const isIssuer = await readOnlyContract.issuers(normalizedAddress)
          console.log(`Verification attempt ${i + 1}: isIssuer =`, isIssuer)
          
          if (isIssuer) {
            verified = true
            console.log('✅ Issuer verified on-chain!')
            break
          }
        } catch (verifyError) {
          console.log(`Verification attempt ${i + 1} failed:`, verifyError.message)
        }
      }

      if (!verified) {
        console.warn('⚠️ Transaction succeeded but could not verify issuer on-chain')
        // Still show success but warn user
        setMessage({ 
          type: 'error', 
          text: `Transaction succeeded but verification failed. Please refresh and check.` 
        })
      } else {
        // Log activity
        logActivity(account, ActivityType.ISSUER_ADDED, {
          address: normalizedAddress,
        })
        
        setMessage({ type: 'success', text: `Issuer ${formatAddress(normalizedAddress)} added successfully!` })
      }
      
      setNewIssuerAddress('')
      // Reload roles from contract to ensure consistency
      await loadRoles()
    } catch (error) {
      console.error('Error adding issuer:', error)
      setMessage({ type: 'error', text: `Failed to add issuer: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveIssuer = async (issuerAddress) => {
    if (!window.confirm(`Remove issuer ${formatAddress(issuerAddress)}?`)) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const contract = await getRoleManagerContract()
      const tx = await contract.removeIssuer(issuerAddress)
      await tx.wait()

      // Log activity
      logActivity(account, ActivityType.ISSUER_REMOVED, {
        address: issuerAddress,
      })

      setMessage({ type: 'success', text: `Issuer ${formatAddress(issuerAddress)} removed successfully!` })
      // Reload roles from contract to ensure consistency
      await loadRoles()
    } catch (error) {
      console.error('Error removing issuer:', error)
      setMessage({ type: 'error', text: `Failed to remove issuer: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleAddVerifier = async () => {
    if (!newVerifierAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter a verifier address' })
      return
    }

    if (!ethers.isAddress(newVerifierAddress.trim())) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // First check if MetaMask is connected
      if (!checkMetaMask()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.')
      }

      // Verify contract is accessible
      const readOnlyContract = getRoleManagerContractReadOnly()
      
      if (!readOnlyContract) {
        throw new Error('RoleManager contract not available. Please deploy contracts first.')
      }

      const contractAddress = readOnlyContract.target || readOnlyContract.address
      
      if (!contractAddress || contractAddress === '0x' || contractAddress === '') {
        throw new Error('RoleManager contract address not set. Please deploy contracts first.')
      }

      // Verify contract code exists
      // In ethers v6, provider might be accessible via contract.provider or contract.runner.provider
      const provider = readOnlyContract.provider || (readOnlyContract.runner && readOnlyContract.runner.provider)
      
      if (!provider) {
        throw new Error('Provider not available. Please make sure MetaMask is connected and refresh the page.')
      }

      const code = await provider.getCode(contractAddress)
      if (code === '0x' || code === '0x0') {
        throw new Error('RoleManager contract not deployed at this address. Please deploy contracts.')
      }

      // Verify user is owner
      const ownerAddress = await readOnlyContract.owner()
      const normalizedAccount = ethers.getAddress(account)
      if (ethers.getAddress(ownerAddress).toLowerCase() !== normalizedAccount.toLowerCase()) {
        throw new Error('Only the contract owner can add verifiers. Your address does not match the owner.')
      }

      const contract = await getRoleManagerContract()
      const normalizedAddress = ethers.getAddress(newVerifierAddress.trim())
      
      console.log('Adding verifier:', normalizedAddress)
      console.log('Contract address:', contractAddress)
      console.log('Owner address:', ownerAddress)
      console.log('Your address:', normalizedAccount)
      
      const tx = await contract.addVerifier(normalizedAddress)
      console.log('Transaction sent:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt.status)
      
      if (receipt.status !== 1) {
        throw new Error('Transaction failed')
      }

      // Verify the verifier was actually saved by reading from contract
      let verified = false
      
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms between retries
        try {
          const isVerifier = await readOnlyContract.verifiers(normalizedAddress)
          console.log(`Verification attempt ${i + 1}: isVerifier =`, isVerifier)
          
          if (isVerifier) {
            verified = true
            console.log('✅ Verifier verified on-chain!')
            break
          }
        } catch (verifyError) {
          console.log(`Verification attempt ${i + 1} failed:`, verifyError.message)
        }
      }

      if (!verified) {
        console.warn('⚠️ Transaction succeeded but could not verify verifier on-chain')
        // Still show success but warn user
        setMessage({ 
          type: 'error', 
          text: `Transaction succeeded but verification failed. Please refresh and check.` 
        })
      } else {
        // Log activity
        logActivity(account, ActivityType.VERIFIER_ADDED, {
          address: normalizedAddress,
        })
        
        setMessage({ type: 'success', text: `Verifier ${formatAddress(normalizedAddress)} added successfully!` })
      }
      
      setNewVerifierAddress('')
      // Reload roles from contract to ensure consistency
      await loadRoles()
    } catch (error) {
      console.error('Error adding verifier:', error)
      setMessage({ type: 'error', text: `Failed to add verifier: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleTransferOwnership = async () => {
    if (!transferToAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter an address to transfer ownership to' })
      return
    }

    if (!ethers.isAddress(transferToAddress.trim())) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' })
      return
    }

    if (!window.confirm(`Transfer ownership to ${formatAddress(transferToAddress.trim())}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const contract = await getRoleManagerContract()
      const normalizedAddress = ethers.getAddress(transferToAddress.trim())
      const tx = await contract.setOwner(normalizedAddress)
      await tx.wait()

      // Log activity
      logActivity(account, ActivityType.OWNERSHIP_TRANSFERRED, {
        newOwner: normalizedAddress,
      })

      setMessage({ type: 'success', text: `Ownership transferred to ${formatAddress(normalizedAddress)} successfully!` })
      setTransferToAddress('')
      setShowTransferOwnership(false)
      
      // Reload to update owner status
      await loadRoles()
    } catch (error) {
      console.error('Error transferring ownership:', error)
      setMessage({ type: 'error', text: `Failed to transfer ownership: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveVerifier = async (verifierAddress) => {
    if (!window.confirm(`Remove verifier ${formatAddress(verifierAddress)}?`)) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const contract = await getRoleManagerContract()
      const tx = await contract.removeVerifier(verifierAddress)
      await tx.wait()

      // Log activity
      logActivity(account, ActivityType.VERIFIER_REMOVED, {
        address: verifierAddress,
      })

      setMessage({ type: 'success', text: `Verifier ${formatAddress(verifierAddress)} removed successfully!` })
      // Reload roles from contract to ensure consistency
      await loadRoles()
    } catch (error) {
      console.error('Error removing verifier:', error)
      setMessage({ type: 'error', text: `Failed to remove verifier: ${error.message}` })
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
          Owner Dashboard
        </h2>
        <p className="text-gray-400 mb-2">
          Manage issuers and verifiers in the system.
        </p>
        <p className="text-sm text-gray-500">
          Connected as: <span className="text-neon-cyan font-mono">{formatAddress(account)}</span>
        </p>
        {contractOwner && (
          <p className="text-sm text-gray-500 mt-1">
            Contract Owner: <span className={`font-mono ${isContractOwner ? 'text-neon-cyan' : 'text-yellow-400'}`}>
              {formatAddress(contractOwner)}
            </span>
            {!isContractOwner && (
              <span className="text-yellow-400 text-xs ml-2">⚠️ You need to be the contract owner to add issuers/verifiers</span>
            )}
          </p>
        )}
      </div>

      <AnimatePresence>
        {!contractAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-neon-cyan/20 border-2 border-neon-cyan/50 text-neon-cyan"
          >
            <p className="font-bold mb-2">⚠️ RoleManager Contract Not Available</p>
            <p className="text-sm">
              The RoleManager contract is not deployed or not accessible. Please:
            </p>
            <ul className="text-sm list-disc list-inside mt-2 space-y-1">
              <li>Make sure Hardhat node is running: <code className="bg-dark-card px-2 py-1 rounded">npm run node</code></li>
              <li>Deploy contracts: <code className="bg-dark-card px-2 py-1 rounded">npm run deploy</code></li>
              <li>Check that <code className="bg-dark-card px-2 py-1 rounded">contractAddresses.json</code> has the correct RoleManager address</li>
            </ul>
          </motion.div>
        )}

        {contractOwner && !isContractOwner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-neon-cyan/20 border-2 border-neon-cyan/50 text-neon-cyan"
          >
            <p className="font-bold mb-2">⚠️ Ownership Mismatch</p>
            <p className="text-sm mb-2">
              You are connected as <span className="font-mono">{formatAddress(account)}</span>, but the contract owner is <span className="font-mono">{formatAddress(contractOwner)}</span>.
            </p>
            <p className="text-sm">
              <strong>To fix this:</strong>
            </p>
            <ul className="text-sm list-disc list-inside mt-2 space-y-1">
              <li>Connect MetaMask with the account that matches the contract owner: <span className="font-mono">{formatAddress(contractOwner)}</span></li>
              <li>Or update your <code className="bg-dark-card px-2 py-1 rounded">.env</code> file to use the private key of the contract owner</li>
              <li>Or ask the current owner to transfer ownership to your address</li>
            </ul>
          </motion.div>
        )}
        
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

      {/* Transfer Ownership Section (only show if user is current owner) */}
      {isContractOwner && contractOwner && (
        <div className="glass-card p-4 border-2 border-neon-cyan/50 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Shield size={24} className="text-neon-cyan" />
              Transfer Ownership
            </h3>
            <button
              onClick={() => setShowTransferOwnership(!showTransferOwnership)}
              className="neon-button-secondary px-4 py-2 text-sm"
            >
              {showTransferOwnership ? 'Hide' : 'Show'}
            </button>
          </div>
          {showTransferOwnership && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Transfer contract ownership to another address. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={transferToAddress}
                  onChange={(e) => setTransferToAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-3 bg-dark-card border-2 border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 text-lg"
                />
                <button
                  onClick={handleTransferOwnership}
                  disabled={loading || !transferToAddress.trim()}
                  className="px-6 py-3 bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan/50 hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Issuer Section */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
          <UserPlus size={24} className="text-neon-cyan" />
          Add Issuer
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newIssuerAddress}
            onChange={(e) => setNewIssuerAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-3 bg-dark-card border-2 border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 text-lg"
          />
          <button
            onClick={handleAddIssuer}
            disabled={loading || !newIssuerAddress.trim()}
            className="neon-button px-6 py-3 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Issuer'}
          </button>
        </div>
      </div>

      {/* Issuers List */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Issuers ({issuers.length})</h3>
        {issuers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No issuers added yet</p>
        ) : (
          <div className="space-y-2">
            {issuers.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-card border-2 border-gray-700"
              >
                <span className="text-neon-cyan font-mono text-sm">{formatAddress(address)}</span>
                <button
                  onClick={() => handleRemoveIssuer(address)}
                  disabled={loading}
                  className="px-3 py-1 bg-neon-purple/20 text-neon-purple border-2 border-neon-purple/50 hover:bg-neon-purple/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <X size={16} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Verifier Section */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
          <UserPlus size={24} className="text-neon-purple" />
          Add Verifier
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newVerifierAddress}
            onChange={(e) => setNewVerifierAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-3 bg-dark-card border-2 border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 text-lg"
          />
          <button
            onClick={handleAddVerifier}
            disabled={loading || !newVerifierAddress.trim()}
            className="neon-button px-6 py-3 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Verifier'}
          </button>
        </div>
      </div>

      {/* Verifiers List */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Verifiers ({verifiers.length})</h3>
        {verifiers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No verifiers added yet</p>
        ) : (
          <div className="space-y-2">
            {verifiers.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-card border-2 border-gray-700"
              >
                <span className="text-neon-purple font-mono text-sm">{formatAddress(address)}</span>
                <button
                  onClick={() => handleRemoveVerifier(address)}
                  disabled={loading}
                  className="px-3 py-1 bg-neon-purple/20 text-neon-purple border-2 border-neon-purple/50 hover:bg-neon-purple/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <X size={16} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default OwnerDashboard

