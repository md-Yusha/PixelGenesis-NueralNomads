/**
 * Activity Logger Utility
 * Tracks user activities and stores them in localStorage
 */

const ACTIVITY_STORAGE_KEY = 'pixellocker_activities'

export const ActivityType = {
  DOCUMENT_VIEWED: 'document_viewed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  CREDENTIAL_ISSUED: 'credential_issued',
  CREDENTIAL_REVOKED: 'credential_revoked',
  CREDENTIAL_VERIFIED: 'credential_verified',
  DOCUMENT_SHARED: 'document_shared',
  DID_REGISTERED: 'did_registered',
  DID_UPDATED: 'did_updated',
  ISSUER_ADDED: 'issuer_added',
  ISSUER_REMOVED: 'issuer_removed',
  VERIFIER_ADDED: 'verifier_added',
  VERIFIER_REMOVED: 'verifier_removed',
  OWNERSHIP_TRANSFERRED: 'ownership_transferred',
  DOCUMENT_SCANNED: 'document_scanned',
}

/**
 * Get all activities for a user
 */
export const getActivities = (userAddress) => {
  try {
    const allActivities = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]')
    // Filter activities for the current user
    return allActivities.filter(activity => 
      activity.userAddress && activity.userAddress.toLowerCase() === userAddress.toLowerCase()
    )
  } catch (error) {
    console.error('Error getting activities:', error)
    return []
  }
}

/**
 * Log an activity
 */
export const logActivity = (userAddress, type, details = {}) => {
  try {
    const activities = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]')
    
    const activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userAddress: userAddress.toLowerCase(),
      type,
      timestamp: new Date().toISOString(),
      details,
    }
    
    activities.unshift(activity) // Add to beginning
    
    // Keep only last 1000 activities per user to prevent storage bloat
    const userActivities = activities.filter(a => 
      a.userAddress && a.userAddress.toLowerCase() === userAddress.toLowerCase()
    )
    if (userActivities.length > 1000) {
      const toKeep = userActivities.slice(0, 1000)
      const otherActivities = activities.filter(a => 
        a.userAddress && a.userAddress.toLowerCase() !== userAddress.toLowerCase()
      )
      const updated = [...toKeep, ...otherActivities]
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated))
    } else {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities))
    }
    
    return activity
  } catch (error) {
    console.error('Error logging activity:', error)
    return null
  }
}

/**
 * Clear activities for a user
 */
export const clearActivities = (userAddress) => {
  try {
    const allActivities = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]')
    const filtered = allActivities.filter(activity => 
      activity.userAddress && activity.userAddress.toLowerCase() !== userAddress.toLowerCase()
    )
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error clearing activities:', error)
  }
}

/**
 * Get activity type label
 */
export const getActivityLabel = (type) => {
  const labels = {
    [ActivityType.DOCUMENT_VIEWED]: 'Viewed Document',
    [ActivityType.DOCUMENT_UPLOADED]: 'Uploaded Document',
    [ActivityType.CREDENTIAL_ISSUED]: 'Issued Credential',
    [ActivityType.CREDENTIAL_REVOKED]: 'Revoked Credential',
    [ActivityType.CREDENTIAL_VERIFIED]: 'Verified Credential',
    [ActivityType.DOCUMENT_SHARED]: 'Shared Document',
    [ActivityType.DID_REGISTERED]: 'Registered DID',
    [ActivityType.DID_UPDATED]: 'Updated DID',
    [ActivityType.ISSUER_ADDED]: 'Added Issuer',
    [ActivityType.ISSUER_REMOVED]: 'Removed Issuer',
    [ActivityType.VERIFIER_ADDED]: 'Added Verifier',
    [ActivityType.VERIFIER_REMOVED]: 'Removed Verifier',
    [ActivityType.OWNERSHIP_TRANSFERRED]: 'Transferred Ownership',
    [ActivityType.DOCUMENT_SCANNED]: 'Scanned Document',
  }
  return labels[type] || type
}

/**
 * Get activity icon based on type
 */
export const getActivityIcon = (type) => {
  // This will be handled in the component with lucide-react icons
  return type
}

