import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, QrCode, Copy, CheckCircle, X } from 'lucide-react'
import { ethers } from 'ethers'
import { getCredentialManagerContractReadOnly } from '../../utils/web3'
import { formatAddress } from '../../utils/helpers'
import { getIPFSFileUrl } from '../../utils/ipfs'
import * as QRCode from 'qrcode'

const ShareCredentials = ({ account }) => {
  const [credentials, setCredentials] = useState([])
  const [personalDocuments, setPersonalDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [account])

  const loadDocuments = async () => {
    // Load credentials
    try {
      const contract = getCredentialManagerContractReadOnly()
      const normalizedAccount = ethers.getAddress(account)
      const credentialIds = await contract.getCredentialsBySubject(normalizedAccount)
      
      const credentialPromises = credentialIds.map(async (id) => {
        try {
          const cred = await contract.getCredential(id)
          return {
            id,
            name: `Credential ${id.substring(0, 8)}...`,
            ipfsHash: cred.ipfsHash,
            type: 'credential',
            issuer: cred.issuer
          }
        } catch (err) {
          return null
        }
      })
      
      const creds = (await Promise.all(credentialPromises)).filter(c => c !== null)
      setCredentials(creds)
    } catch (error) {
      console.error('Error loading credentials:', error)
      setCredentials([])
    }

    // Load personal documents
    try {
      const docs = JSON.parse(localStorage.getItem('personalDocuments') || '[]')
      const userDocs = docs
        .filter(doc => doc.owner && doc.owner.toLowerCase() === account.toLowerCase())
        .map(doc => ({
          id: doc.ipfsHash,
          name: doc.name || 'Personal Document',
          ipfsHash: doc.ipfsHash,
          type: 'personal'
        }))
      setPersonalDocuments(userDocs)
    } catch (error) {
      console.error('Error loading personal documents:', error)
      setPersonalDocuments([])
    }
  }

  const allDocuments = [...credentials, ...personalDocuments]

  const handleGenerateQR = async () => {
    if (!selectedDocument) {
      setMessage({ type: 'error', text: 'Please select a document to share' })
      return
    }

    if (!recipientAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter recipient address' })
      return
    }

    if (!ethers.isAddress(recipientAddress.trim())) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const normalizedRecipient = ethers.getAddress(recipientAddress.trim())
      
      // Create share data
      const shareData = {
        documentId: selectedDocument.id,
        documentName: selectedDocument.name,
        ipfsHash: selectedDocument.ipfsHash,
        documentType: selectedDocument.type,
        sender: account,
        recipient: normalizedRecipient,
        timestamp: Date.now(),
        ipfsUrl: getIPFSFileUrl(selectedDocument.ipfsHash)
      }

      // Generate QR code with URL format (same as share link)
      // This makes it consistent and easier to scan
      const shareLink = `${window.location.origin}/share?data=${encodeURIComponent(JSON.stringify(shareData))}`
      const qrCodeUrl = await QRCode.toDataURL(shareLink, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#00FFFF',
          light: '#000000'
        }
      })

      setQrCodeDataUrl(qrCodeUrl)
      setMessage({ 
        type: 'success', 
        text: 'QR code generated! The recipient can scan this to access the document.' 
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      setMessage({ type: 'error', text: `Failed to generate QR code: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!selectedDocument) return

    try {
      const shareData = {
        documentId: selectedDocument.id,
        documentName: selectedDocument.name,
        ipfsHash: selectedDocument.ipfsHash,
        documentType: selectedDocument.type,
        sender: account,
        recipient: recipientAddress.trim(),
        timestamp: Date.now(),
        ipfsUrl: getIPFSFileUrl(selectedDocument.ipfsHash)
      }

      const shareLink = `${window.location.origin}/share?data=${encodeURIComponent(JSON.stringify(shareData))}`
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
      setMessage({ type: 'error', text: 'Failed to copy link' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-100 mb-2 flex items-center gap-3">
          <Share2 size={32} className="text-neon-cyan" />
          Share Credentials
        </h2>
        <p className="text-gray-400">
          Select a document to share with another user by generating a QR code or share link.
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                : 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-6 rounded-xl space-y-6">
        {/* Document Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Document to Share
          </label>
          {allDocuments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No documents available to share. Upload documents or wait for credentials to be issued.
            </p>
          ) : (
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {allDocuments.map((doc, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(doc)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedDocument?.id === doc.id
                      ? 'bg-neon-cyan/20 border-2 border-neon-cyan'
                      : 'bg-dark-card border border-gray-700 hover:border-neon-cyan/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100 font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.type === 'credential' ? 'Credential' : 'Personal Document'}
                      </p>
                    </div>
                    {selectedDocument?.id === doc.id && (
                      <CheckCircle size={20} className="text-neon-cyan" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the Ethereum address of the person you want to share with
          </p>
        </div>

        {/* Generate QR Button */}
        <button
          onClick={handleGenerateQR}
          disabled={loading || !selectedDocument || !recipientAddress.trim()}
          className="neon-button w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <QrCode size={20} />
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>

        {/* QR Code Display */}
        {qrCodeDataUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4 p-6 bg-dark-card rounded-lg"
          >
            <h3 className="text-lg font-bold text-gray-100">Share QR Code</h3>
            <div className="p-4 bg-white rounded-lg">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-sm text-gray-400 text-center max-w-md">
              The recipient can scan this QR code to access the shared document.
            </p>
            <button
              onClick={handleCopyLink}
              className="neon-button-secondary px-4 py-2 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Share Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ShareCredentials

