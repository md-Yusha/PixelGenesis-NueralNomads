import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, FileText, Upload, Key, Shield, LogOut, UserPlus, Share2, Scan, Activity } from 'lucide-react'
import HomeTab from '../components/dashboard/HomeTab'
import MyDocuments from '../components/dashboard/MyDocuments'
import UploadDocuments from '../components/dashboard/UploadDocuments'
import IssueDocument from '../components/dashboard/IssueDocument'
import DIDManager from '../components/dashboard/DIDManager'
import IssuerDashboard from '../components/dashboard/IssuerDashboard'
import OwnerDashboard from '../components/dashboard/OwnerDashboard'
import ShareCredentials from '../components/dashboard/ShareCredentials'
import ScanDocument from '../components/dashboard/ScanDocument'
import ActivityTab from '../components/dashboard/ActivityTab'
import { formatAddress } from '../utils/helpers'
import { determineUserRole } from '../utils/roles'

const Dashboard = ({ account, setAccount }) => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState('user')
  const [loadingRole, setLoadingRole] = useState(true)

  useEffect(() => {
    loadUserRole()
  }, [account])

  const loadUserRole = async () => {
    if (!account) {
      setLoadingRole(false)
      return
    }

    setLoadingRole(true)
    try {
      const role = await determineUserRole(account)
      setUserRole(role)
    } catch (error) {
      console.error('Error loading user role:', error)
      setUserRole('user')
    } finally {
      setLoadingRole(false)
    }
  }

  const handleDisconnect = () => {
    setAccount(null)
    navigate('/', { replace: true })
  }

  // Define tabs based on role
  const getTabs = () => {
    const baseTabs = []
    
    if (userRole === 'owner') {
      baseTabs.push(
        { id: 'owner', label: 'Owner Dashboard', icon: Shield, path: '/dashboard/owner' }
      )
    } else if (userRole === 'issuer') {
      baseTabs.push(
        { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
        { id: 'issuer', label: 'Issuer Dashboard', icon: Shield, path: '/dashboard/issuer' },
        { id: 'issue', label: 'Issue Document', icon: Upload, path: '/dashboard/issue' },
        { id: 'scan', label: 'Scan Document', icon: Scan, path: '/dashboard/scan' }
      )
    } else if (userRole === 'verifier') {
      baseTabs.push(
        { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
        { id: 'scan', label: 'Scan Document', icon: Scan, path: '/dashboard/scan' }
      )
    } else {
      // User role
      baseTabs.push(
        { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
        { id: 'documents', label: 'My Documents', icon: FileText, path: '/dashboard/documents' },
        { id: 'upload', label: 'Upload Documents', icon: Upload, path: '/dashboard/upload' },
        { id: 'did', label: 'DID Manager', icon: Key, path: '/dashboard/did' },
        { id: 'share', label: 'Share Credentials', icon: Share2, path: '/dashboard/share' },
        { id: 'scan', label: 'Scan Document', icon: Scan, path: '/dashboard/scan' }
      )
    }
    
    // Add Activity tab to all roles
    baseTabs.push(
      { id: 'activity', label: 'Activity', icon: Activity, path: '/dashboard/activity' }
    )
    
    return baseTabs
  }

  const tabs = getTabs()

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="glass-card border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-3 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-pixel text-sm neon-cyan">PixelLocker</h1>
              <div className="hidden md:block h-3 w-px bg-gray-700" />
              <div className="text-xs">
                <div className="text-gray-400 text-xs">Connected as</div>
                <div className="text-neon-cyan font-mono text-xs">{formatAddress(account)}</div>
                {!loadingRole && (
                  <div className="text-xs text-gray-500 capitalize">
                    Role: <span className="text-neon-purple">{userRole}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="neon-button-secondary px-2 py-1 flex items-center gap-1 text-xs"
            >
              <LogOut size={12} />
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 transition-all ${
                        isActive
                          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                          : 'text-gray-400 hover:text-neon-cyan hover:bg-dark-card'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              {/* Owner Routes */}
              {userRole === 'owner' ? (
                <>
                  <Route path="/" element={<OwnerDashboard account={account} />} />
                  <Route path="/owner" element={<OwnerDashboard account={account} />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomeTab account={account} />} />
                  
                  {/* Issuer Routes */}
                  {userRole === 'issuer' && (
                    <>
                      <Route path="/issuer" element={<IssuerDashboard account={account} />} />
                      <Route path="/issue" element={<IssueDocument account={account} />} />
                    </>
                  )}
                  
                  {/* User Routes */}
                  {userRole === 'user' && (
                    <>
                      <Route path="/documents" element={<MyDocuments account={account} />} />
                      <Route path="/upload" element={<UploadDocuments account={account} />} />
                      <Route path="/did" element={<DIDManager account={account} />} />
                      <Route path="/share" element={<ShareCredentials account={account} />} />
                    </>
                  )}
                  
                  {/* Scan Document Route - Available for issuer, verifier, and user */}
                  {(userRole === 'issuer' || userRole === 'verifier' || userRole === 'user') && (
                    <Route path="/scan" element={<ScanDocument account={account} />} />
                  )}
                  
                  {/* Activity Route - Available for all roles */}
                  <Route path="/activity" element={<ActivityTab account={account} />} />
                  
                  {/* Verifier Routes - will be added later */}
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

