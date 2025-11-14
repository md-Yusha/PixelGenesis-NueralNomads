import { motion } from 'framer-motion'
import { Wallet, Upload, Share2, CheckCircle, Shield, Lock, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
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

  const steps = [
    {
      number: '1',
      icon: <Wallet size={32} />,
      title: 'Connect Your Digital Key',
      description: 'Connect your MetaMask wallet. This becomes your unique digital identity.',
      colorClass: 'text-neon-cyan'
    },
    {
      number: '2',
      icon: <Upload size={32} />,
      title: 'Upload Your Documents',
      description: 'Upload important documents. They\'re stored securely on IPFS - only you control access.',
      colorClass: 'text-neon-purple'
    },
    {
      number: '3',
      icon: <Share2 size={32} />,
      title: 'Share When Needed',
      description: 'Generate proof documents with only the information you want to share.',
      colorClass: 'text-neon-cyan'
    },
    {
      number: '4',
      icon: <CheckCircle size={32} />,
      title: 'Verify & Trust',
      description: 'Anyone can verify your documents are authentic by checking the blockchain.',
      colorClass: 'text-neon-purple'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="flex items-center justify-center h-screen">
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
              className="text-pixel text-3xl md:text-4xl mb-6 neon-cyan"
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
              className="text-base text-gray-400 mb-12"
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
                className="neon-button text-base px-8 py-4 flex items-center gap-2 mx-auto"
              >
                <Wallet size={24} />
                Connect Wallet
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <section className="flex items-center justify-center h-screen w-full px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl"
        >
          <div className="glass-card p-8 md:p-12">
            <div className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-100 flex items-center gap-2">
                <Shield size={28} className="text-neon-cyan" />
                About PixelLocker
              </h2>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-4xl">
                PixelLocker is a decentralized identity and document management system built on blockchain technology. 
                It empowers you to take full control of your digital identity and important documents.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex flex-col items-center text-center p-6 md:p-8 border-2 border-gray-700">
                <Lock size={40} className="text-neon-cyan mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-3 text-gray-100">Secure</h3>
                <p className="text-sm md:text-base text-gray-400">Your documents are encrypted and stored on decentralized IPFS</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 md:p-8 border-2 border-gray-700">
                <Globe size={40} className="text-neon-purple mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-3 text-gray-100">Decentralized</h3>
                <p className="text-sm md:text-base text-gray-400">No central authority controls your data</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 md:p-8 border-2 border-gray-700">
                <CheckCircle size={40} className="text-neon-cyan mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-3 text-gray-100">Verifiable</h3>
                <p className="text-sm md:text-base text-gray-400">Documents are verified on the blockchain</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="flex items-center justify-center h-screen w-full px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto w-full"
        >
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">How It Works</h2>
            <p className="text-base md:text-lg text-gray-400">
              Simple, secure, and completely under your control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-card p-6 md:p-8"
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <div className={`${step.colorClass} flex-shrink-0`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-pixel text-lg md:text-xl neon-cyan">{step.number}</span>
                      <h3 className="text-base md:text-lg font-bold text-gray-100">{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <Link
              to="/how-it-works"
              className="neon-button-secondary text-base md:text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default Landing

