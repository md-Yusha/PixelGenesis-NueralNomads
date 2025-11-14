import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, Upload, Camera, X, FileText, Download, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { formatAddress } from '../../utils/helpers'
import { getIPFSFileUrl } from '../../utils/ipfs'
import { logActivity, ActivityType } from '../../utils/activityLogger'

const ScanDocument = ({ account }) => {
  const [scanning, setScanning] = useState(false)
  const [scanMode, setScanMode] = useState('camera') // 'camera' or 'upload'
  const [scannedData, setScannedData] = useState(null)
  const [documentData, setDocumentData] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopScanning()
    }
  }, [])

  const stopScanning = () => {
    if (html5QrCodeRef.current && scanning) {
      html5QrCodeRef.current.stop().catch(err => {
        console.error('Error stopping scanner:', err)
      })
      setScanning(false)
    }
  }

  const startCameraScan = async () => {
    try {
      setError(null)
      setMessage(null)
      setScannedData(null)
      setDocumentData(null)

      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      setScanning(true)
      setMessage({ type: 'info', text: 'Starting camera... Please allow camera access.' })

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText, decodedResult) => {
          // Success callback
          handleScannedData(decodedText)
          stopScanning()
        },
        (errorMessage) => {
          // Error callback - ignore, scanner will keep trying
        }
      )
    } catch (err) {
      console.error('Error starting camera:', err)
      setError(err.message)
      setScanning(false)
      if (err.message.includes('Permission denied') || err.message.includes('NotAllowedError')) {
        setMessage({ type: 'error', text: 'Camera access denied. Please allow camera access in your browser settings.' })
      } else {
        setMessage({ type: 'error', text: `Failed to start camera: ${err.message}` })
      }
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setMessage(null)
    setScannedData(null)
    setDocumentData(null)

    try {
      setMessage({ type: 'info', text: 'Scanning image for QR code...' })

      // For file scanning, we don't need to attach to a DOM element
      // We can use Html5Qrcode without initialization
      const decodedText = await Html5Qrcode.scanFile(file, true)
      
      if (decodedText) {
        handleScannedData(decodedText)
      } else {
        setMessage({ type: 'error', text: 'No QR code found in the image. Please try another image.' })
      }
    } catch (err) {
      console.error('Error scanning image:', err)
      const errorMessage = err?.message || 'Unknown error'
      if (errorMessage.includes('No QR code found') || errorMessage.includes('NotFoundException')) {
        setMessage({ type: 'error', text: 'No QR code found in the image. Please make sure the image contains a clear QR code.' })
      } else if (errorMessage.includes('not found')) {
        setMessage({ type: 'error', text: 'Failed to process image. Please try another image file.' })
      } else {
        setMessage({ type: 'error', text: `Failed to scan image: ${errorMessage}` })
      }
    } finally {
      setLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleScannedData = (decodedText) => {
    try {
      setScannedData(decodedText)
      setMessage({ type: 'info', text: 'QR code scanned! Processing document...' })

      // Try to parse as JSON (our share data format)
      let shareData
      try {
        shareData = JSON.parse(decodedText)
      } catch (e) {
        // If not JSON, check if it's a URL with query params
        if (decodedText.startsWith('http')) {
          const url = new URL(decodedText)
          const dataParam = url.searchParams.get('data')
          if (dataParam) {
            shareData = JSON.parse(decodeURIComponent(dataParam))
          } else {
            throw new Error('Invalid QR code format')
          }
        } else {
          throw new Error('Invalid QR code format')
        }
      }

      // Validate share data structure
      if (!shareData.ipfsHash || !shareData.documentName) {
        throw new Error('Invalid document data in QR code')
      }

      // Set document data
      setDocumentData({
        ...shareData,
        ipfsUrl: shareData.ipfsUrl || getIPFSFileUrl(shareData.ipfsHash)
      })

      // Log activity
      if (account) {
        logActivity(account, ActivityType.DOCUMENT_SCANNED, {
          documentName: shareData.documentName,
          ipfsHash: shareData.ipfsHash,
        })
      }

      setMessage({ 
        type: 'success', 
        text: 'Document found! You can now view and download it.' 
      })
    } catch (err) {
      console.error('Error processing scanned data:', err)
      setError(err.message)
      setMessage({ 
        type: 'error', 
        text: `Failed to process QR code: ${err.message}. Make sure you scanned a valid PixelLocker document QR code.` 
      })
    }
  }

  const handleDownload = async () => {
    if (!documentData?.ipfsUrl) return

    try {
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

  const resetScan = () => {
    stopScanning()
    setScanning(false)
    setScannedData(null)
    setDocumentData(null)
    setError(null)
    setMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
          <Scan size={32} className="text-neon-cyan" />
          Scan Document
        </h2>
        <p className="text-gray-400">
          Scan a QR code or upload an image to access shared documents.
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
                : message.type === 'success'
                ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
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
      </AnimatePresence>

      {!documentData ? (
        <div className="glass-card p-4 space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetScan()
                setScanMode('camera')
              }}
              className={`flex-1 px-4 py-3 transition-all ${
                scanMode === 'camera'
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'bg-dark-card border border-gray-700 text-gray-400 hover:border-neon-cyan/50'
              }`}
            >
              <Camera size={24} className="mx-auto mb-2" />
              <span className="font-medium">Camera Scan</span>
            </button>
            <button
              onClick={() => {
                resetScan()
                setScanMode('upload')
              }}
              className={`flex-1 px-4 py-3 transition-all ${
                scanMode === 'upload'
                  ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                  : 'bg-dark-card border border-gray-700 text-gray-400 hover:border-neon-cyan/50'
              }`}
            >
              <Upload size={24} className="mx-auto mb-2" />
              <span className="font-medium">Upload Image</span>
            </button>
          </div>

          {/* Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div id="qr-reader" className="w-full overflow-hidden bg-black min-h-[300px] border-2 border-gray-700"></div>
              
              {!scanning ? (
                <button
                  onClick={startCameraScan}
                  className="neon-button w-full py-3 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Start Camera Scan
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="neon-button-secondary w-full py-3 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Stop Scanning
                </button>
              )}
            </div>
          )}

          {/* Image Upload */}
          {scanMode === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 p-8 text-center">
                <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-4">
                  Upload an image containing a QR code
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="neon-button inline-block px-6 py-3 cursor-pointer"
                >
                  {loading ? 'Scanning...' : 'Choose Image'}
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Supported formats: JPG, PNG, GIF. The image should contain a clear QR code.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Document Display */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <FileText size={28} className="text-neon-cyan" />
              Shared Document
            </h3>
            <button
              onClick={resetScan}
              className="neon-button-secondary px-4 py-2 flex items-center gap-2"
            >
              <Scan size={16} />
              Scan Another
            </button>
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

            <div className="flex gap-3 pt-4">
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
        </motion.div>
      )}
    </motion.div>
  )
}

export default ScanDocument

