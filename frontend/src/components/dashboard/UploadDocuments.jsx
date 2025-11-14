import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, X } from 'lucide-react'
import { uploadToIPFS } from '../../utils/ipfs'

const UploadDocuments = ({ account }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentName, setDocumentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload' })
      return
    }

    setLoading(true)
    setMessage(null)
    setSuccess(false)

    try {
      setMessage({ type: 'info', text: 'Uploading document to secure storage...' })
      const ipfsHash = await uploadToIPFS(selectedFile)
      console.log('Document uploaded to IPFS:', ipfsHash)

      // Here you could store the document metadata in local storage or a database
      // For now, we'll just show success
      const documentData = {
        name: documentName || selectedFile.name,
        ipfsHash,
        uploadedAt: new Date().toISOString(),
        owner: account
      }

      // Store in localStorage (in production, you'd use a database)
      const existingDocs = JSON.parse(localStorage.getItem('personalDocuments') || '[]')
      existingDocs.push(documentData)
      localStorage.setItem('personalDocuments', JSON.stringify(existingDocs))

      setMessage({ 
        type: 'success', 
        text: `Document uploaded successfully! IPFS Hash: ${ipfsHash.substring(0, 20)}...` 
      })
      setSuccess(true)

      // Reset form
      setSelectedFile(null)
      setDocumentName('')
      const fileInput = document.getElementById('file-input-upload')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('Error uploading document:', error)
      setMessage({ type: 'error', text: `Failed to upload document: ${error.message}` })
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
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Upload Documents</h2>
        <p className="text-gray-400">
          Upload your personal documents to secure decentralized storage (IPFS).
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
                : message.type === 'success'
                ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
                : 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {success && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 rounded-xl border-2 border-neon-cyan/50"
        >
          <div className="flex items-center gap-3 text-neon-cyan mb-4">
            <CheckCircle size={32} />
            <h3 className="text-xl font-bold">Document Uploaded Successfully!</h3>
          </div>
          <p className="text-gray-400">
            Your document has been uploaded to secure decentralized storage (IPFS).
            You can view it in "My Documents".
          </p>
        </motion.div>
      )}

      <form onSubmit={handleUpload} className="glass-card p-8 rounded-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Document Name
          </label>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="e.g., Passport, Driver License, Certificate"
            className="w-full px-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Document File
          </label>
          <div
            onClick={() => document.getElementById('file-input-upload').click()}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-neon-cyan transition-colors"
          >
            <input
              id="file-input-upload"
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              required
            />
            <Upload size={48} className="mx-auto mb-4 text-gray-600" />
            {selectedFile ? (
              <div>
                <p className="text-neon-cyan font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-1">Click to select file</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            File will be uploaded to secure decentralized storage (IPFS)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="neon-button w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </motion.div>
  )
}

export default UploadDocuments

