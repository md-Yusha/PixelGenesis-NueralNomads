import { useState } from 'react';
import { Shield, Key, Fingerprint, CheckCircle2, ArrowRight, Zap, Lock, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      title: 'DECENTRALIZED',
      description: 'Your identity, your control. No central authority.',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      icon: Lock,
      title: 'SECURE',
      description: 'Blockchain-backed credentials with cryptographic proof.',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      icon: Globe,
      title: 'UNIVERSAL',
      description: 'One identity that works everywhere, instantly.',
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'CONNECT WALLET',
      description: 'Connect your Web3 wallet to create your decentralized identity',
      icon: Key
    },
    {
      number: '02',
      title: 'CREATE DID',
      description: 'Generate your unique Decentralized Identifier on the blockchain',
      icon: Fingerprint
    },
    {
      number: '03',
      title: 'GET CREDENTIALS',
      description: 'Receive verifiable credentials from trusted issuers',
      icon: Shield
    },
    {
      number: '04',
      title: 'VERIFY ANYWHERE',
      description: 'Share and verify your credentials instantly and securely',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="absolute inset-0 bg-pixel-grid opacity-20"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center pixel-corners glow-purple">
              <Key className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="pixel-text text-5xl md:text-7xl mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            PIXELGENESIS
          </h1>
          
          <p className="pixel-text text-lg md:text-2xl text-gray-400 mb-4">
            DECENTRALIZED IDENTITY PLATFORM
          </p>

          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            Take control of your digital identity. Issue, manage, and verify credentials 
            on the blockchain with zero intermediaries. Your identity, your rules.
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white pixel-text text-sm hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 pixel-corners"
          >
            GET STARTED
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 bg-[#1a1a1a] border border-gray-800 pixel-corners hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center pixel-corners group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="pixel-text text-sm text-indigo-400 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-indigo-500 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-indigo-600/20 border border-indigo-500/50 pixel-corners mb-6">
              <span className="pixel-text text-sm text-indigo-400">HOW IT WORKS</span>
            </div>
            <h2 className="pixel-text text-4xl md:text-5xl mb-4 text-white">
              GET STARTED IN 4 STEPS
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Setting up your decentralized identity is simple and takes less than 5 minutes
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative p-8 bg-[#1a1a1a] border-2 ${
                  activeStep === index ? 'border-indigo-500' : 'border-gray-800'
                } pixel-corners cursor-pointer transition-all duration-300 hover:border-indigo-500/50 group`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 pixel-corners flex items-center justify-center">
                  <span className="pixel-text text-xs text-white">{step.number}</span>
                </div>

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border ${
                      activeStep === index ? 'border-indigo-500' : 'border-gray-700'
                    } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <step.icon className={`w-8 h-8 ${
                        activeStep === index ? 'text-indigo-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="pixel-text text-lg text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Hover Effect */}
                {activeStep === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 pixel-corners pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 pixel-corners">
              <Zap className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="pixel-text text-sm text-white mb-2">INSTANT VERIFICATION</h4>
              <p className="text-gray-400 text-sm">Verify credentials in milliseconds with cryptographic proof</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 pixel-corners">
              <Shield className="w-8 h-8 text-cyan-400 mb-4" />
              <h4 className="pixel-text text-sm text-white mb-2">PRIVACY FIRST</h4>
              <p className="text-gray-400 text-sm">Share only what you need. Full control over your data</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 pixel-corners">
              <Globe className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="pixel-text text-sm text-white mb-2">INTEROPERABLE</h4>
              <p className="text-gray-400 text-sm">Works with W3C standards across all platforms</p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block p-8 bg-[#1a1a1a] border border-gray-800 pixel-corners">
              <h3 className="pixel-text text-2xl text-white mb-4">READY TO START?</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect your wallet and create your decentralized identity in seconds
              </p>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white pixel-text text-sm hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 pixel-corners"
              >
                CONNECT WALLET
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="pixel-text text-xs text-gray-600">
            POWERED BY BLOCKCHAIN TECHNOLOGY
          </p>
        </div>
      </footer>
    </div>
  );
}
