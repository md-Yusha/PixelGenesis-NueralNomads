import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Wallet, Upload, Share2, CheckCircle } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: <Wallet size={48} />,
      title: 'Connect Your Digital Key',
      description: 'Connect your MetaMask wallet. This becomes your unique digital identity - no passwords, no usernames, just your secure key.',
      colorClass: 'text-neon-cyan'
    },
    {
      number: '2',
      icon: <Upload size={48} />,
      title: 'Upload Your Documents',
      description: 'Upload important documents like degrees, certificates, or IDs. They\'re stored securely on IPFS (a decentralized cloud) - only you control access.',
      colorClass: 'text-neon-purple'
    },
    {
      number: '3',
      icon: <Share2 size={48} />,
      title: 'Share When Needed',
      description: 'Generate proof documents with only the information you want to share. No need to reveal everything - just what\'s necessary.',
      colorClass: 'text-neon-cyan'
    },
    {
      number: '4',
      icon: <CheckCircle size={48} />,
      title: 'Verify & Trust',
      description: 'Anyone can verify your documents are authentic by checking the blockchain. No fake documents, no fraud - just trust.',
      colorClass: 'text-neon-purple'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb w-96 h-96 bg-neon-purple top-10 right-10" />
      <div className="glow-orb w-80 h-80 bg-neon-cyan bottom-10 left-10" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <h1 className="text-pixel text-3xl md:text-4xl neon-cyan mb-4">
            How PixelLocker Works
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Simple, secure, and completely under your control. Here's how you can own your digital identity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="glass-card p-4"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
              <div className={`${step.colorClass} flex-shrink-0`}>
                {step.icon}
              </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-pixel text-2xl neon-cyan">{step.number}</span>
                    <h2 className="text-xl font-bold text-gray-100">{step.title}</h2>
                  </div>
                  <p className="text-base text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/"
            className="neon-button text-lg px-8 py-4 inline-block"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default HowItWorks

