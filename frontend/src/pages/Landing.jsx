import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { connectWallet } from '../utils/web3'

const Landing = ({ setAccount }) => {
  const handleConnect = async () => {
    try {
      const account = await connectWallet()
      setAccount(account)
    } catch (error) {
      console.error('Connection error:', error)
      alert('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-pixel text-4xl md:text-6xl mb-6 neon-cyan"
          >
            PixelLocker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl font-bold mb-4 text-gray-100"
          >
            Own Your Digital Identity
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-gray-400 mb-12"
          >
            Securely store and share your important documents. You stay in control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <button
              onClick={handleConnect}
              className="neon-button text-lg px-8 py-4 flex items-center gap-2 mx-auto"
            >
              <Wallet size={24} />
              Connect Wallet
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Landing

