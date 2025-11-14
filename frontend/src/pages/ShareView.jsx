import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Download, ExternalLink, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { formatAddress } from '../utils/helpers'
import { getIPFSFileUrl } from '../utils/ipfs'

const ShareView = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [documentData, setDocumentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    
    if (!dataParam) {
      setError('No document data found in the link')
      setLoading(false)
      return
    }

    try {
      // Decode the data
      const decodedData = JSON.parse(decodeURIComponent(dataParam))
      
      // Validate the data structure
      if (!decodedData.ipfsHash || !decodedData.documentName) {
        throw new Error('Invalid document data format')
      }

      // Set document data
      setDocumentData({
        ...decodedData,
        ipfsUrl: decodedData.ipfsUrl || getIPFSFileUrl(decodedData.ipfsHash)
      })

      setMessage({ 
        type: 'success', 
        text: 'Document loaded successfully!' 
      })
    } catch (err) {
      console.error('Error parsing share data:', err)
      setError(`Failed to load document: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  const handleDownload = async () => {
    if (!documentData?.ipfsUrl) return

    try {
      setMessage({ type: 'info', text: 'Downloading document...' })
      const response = await fetch(documentData.ipfsUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = documentData.documentName || 'document'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setMessage({ type: 'success', text: 'Document downloaded successfully!' })
    } catch (err) {
      console.error('Error downloading document:', err)
      setMessage({ type: 'error', text: 'Failed to download document. Please try again.' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-neon text-neon-cyan text-pixel text-xl mb-4">
            Loading document...
          </div>
          <div className="text-gray-400">Please wait</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl max-w-md w-full">
          <div className="text-center space-y-4">
            <AlertCircle size={64} className="mx-auto text-red-400" />
            <h2 className="text-2xl font-bold text-gray-100">Error</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="neon-button px-6 py-3 mt-4"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!documentData) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl max-w-md w-full">
          <div className="text-center space-y-4">
            <AlertCircle size={64} className="mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold text-gray-100">No Document Found</h2>
            <p className="text-gray-400">The document link is invalid or expired.</p>
            <button
              onClick={() => navigate('/')}
              className="neon-button px-6 py-3 mt-4"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="glass-card border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-pixel text-xl neon-cyan">PixelLocker</h1>
              <div className="hidden md:block h-6 w-px bg-gray-700" />
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'error' 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === 'error' && <AlertCircle size={20} />}
                {message.type === 'success' && <CheckCircle size={20} />}
                <span>{message.text}</span>
              </div>
            </motion.div>
          )}

          <div className="glass-card p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={32} className="text-neon-cyan" />
              <h2 className="text-3xl font-bold text-gray-100">Shared Document</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Document Name</label>
                <p className="text-lg text-gray-100 mt-1">{documentData.documentName}</p>
              </div>

              {documentData.sender && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Shared by</label>
                  <p className="text-gray-100 mt-1 font-mono">{formatAddress(documentData.sender)}</p>
                </div>
              )}

              {documentData.timestamp && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Shared on</label>
                  <p className="text-gray-100 mt-1">
                    {new Date(documentData.timestamp).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400">Document Type</label>
                <p className="text-gray-100 mt-1 capitalize">
                  {documentData.documentType || 'Unknown'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 neon-button py-3 flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download Document
                  </button>
                  <a
                    href={documentData.ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 neon-button-secondary py-3 flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={20} />
                    View Online
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ShareView

