import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, Upload, Shield, X, CheckCircle, Share2, Key, 
  UserPlus, UserMinus, Scan, FileText, Trash2 
} from 'lucide-react'
import { getActivities, clearActivities, getActivityLabel, ActivityType } from '../../utils/activityLogger'
import { formatAddress, formatDate } from '../../utils/helpers'

const ActivityTab = ({ account }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [account])

  const loadActivities = () => {
    if (!account) {
      setActivities([])
      setLoading(false)
      return
    }

    try {
      const userActivities = getActivities(account)
      setActivities(userActivities)
    } catch (error) {
      console.error('Error loading activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity logs?')) {
      clearActivities(account)
      loadActivities()
    }
  }

  const getActivityIcon = (type) => {
    const iconProps = { size: 20 }
    switch (type) {
      case ActivityType.DOCUMENT_VIEWED:
        return <Eye {...iconProps} className="text-neon-cyan" />
      case ActivityType.DOCUMENT_UPLOADED:
        return <Upload {...iconProps} className="text-neon-cyan" />
      case ActivityType.CREDENTIAL_ISSUED:
        return <Shield {...iconProps} className="text-neon-cyan" />
      case ActivityType.CREDENTIAL_REVOKED:
        return <X {...iconProps} className="text-neon-purple" />
      case ActivityType.CREDENTIAL_VERIFIED:
        return <CheckCircle {...iconProps} className="text-neon-cyan" />
      case ActivityType.DOCUMENT_SHARED:
        return <Share2 {...iconProps} className="text-neon-cyan" />
      case ActivityType.DID_REGISTERED:
      case ActivityType.DID_UPDATED:
        return <Key {...iconProps} className="text-neon-cyan" />
      case ActivityType.ISSUER_ADDED:
      case ActivityType.VERIFIER_ADDED:
        return <UserPlus {...iconProps} className="text-neon-cyan" />
      case ActivityType.ISSUER_REMOVED:
      case ActivityType.VERIFIER_REMOVED:
        return <UserMinus {...iconProps} className="text-neon-purple" />
      case ActivityType.OWNERSHIP_TRANSFERRED:
        return <Shield {...iconProps} className="text-neon-purple" />
      case ActivityType.DOCUMENT_SCANNED:
        return <Scan {...iconProps} className="text-neon-cyan" />
      default:
        return <FileText {...iconProps} className="text-neon-cyan" />
    }
  }

  const getActivityDescription = (activity) => {
    const { type, details } = activity
    
    switch (type) {
      case ActivityType.DOCUMENT_VIEWED:
        return `Viewed document: ${details.documentName || 'Unknown'}`
      case ActivityType.DOCUMENT_UPLOADED:
        return `Uploaded: ${details.documentName || 'Document'}`
      case ActivityType.CREDENTIAL_ISSUED:
        return `Issued credential to ${details.recipient ? formatAddress(details.recipient) : 'recipient'}`
      case ActivityType.CREDENTIAL_REVOKED:
        return `Revoked credential ${details.credentialId ? details.credentialId.substring(0, 8) + '...' : ''}`
      case ActivityType.CREDENTIAL_VERIFIED:
        return `Verified credential ${details.credentialId ? details.credentialId.substring(0, 8) + '...' : ''}`
      case ActivityType.DOCUMENT_SHARED:
        return `Shared document with ${details.recipient ? formatAddress(details.recipient) : 'recipient'}`
      case ActivityType.DID_REGISTERED:
        return `Registered DID: ${details.did ? details.did.substring(0, 30) + '...' : ''}`
      case ActivityType.DID_UPDATED:
        return `Updated DID: ${details.did ? details.did.substring(0, 30) + '...' : ''}`
      case ActivityType.ISSUER_ADDED:
        return `Added issuer: ${details.address ? formatAddress(details.address) : ''}`
      case ActivityType.ISSUER_REMOVED:
        return `Removed issuer: ${details.address ? formatAddress(details.address) : ''}`
      case ActivityType.VERIFIER_ADDED:
        return `Added verifier: ${details.address ? formatAddress(details.address) : ''}`
      case ActivityType.VERIFIER_REMOVED:
        return `Removed verifier: ${details.address ? formatAddress(details.address) : ''}`
      case ActivityType.OWNERSHIP_TRANSFERRED:
        return `Transferred ownership to ${details.newOwner ? formatAddress(details.newOwner) : 'new owner'}`
      case ActivityType.DOCUMENT_SCANNED:
        return `Scanned document: ${details.documentName || 'Unknown'}`
      default:
        return 'Activity performed'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse-neon text-neon-cyan">Loading activities...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-100 mb-2">Activity Log</h2>
          <p className="text-xs text-gray-400">
            View all your actions and activities in PixelLocker
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={handleClearActivities}
            className="neon-button-secondary px-4 py-2 text-xs flex items-center gap-2"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 text-center"
        >
          <FileText size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-base text-gray-400 mb-2">No activities yet</p>
          <p className="text-xs text-gray-500">
            Your activities will appear here as you use PixelLocker
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-100">
                      {getActivityLabel(activity.type)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(new Date(activity.timestamp))}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {getActivityDescription(activity)}
                  </p>
                  {activity.details.ipfsHash && (
                    <p className="text-xs text-gray-500 font-mono">
                      IPFS: {activity.details.ipfsHash.substring(0, 20)}...
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ActivityTab

