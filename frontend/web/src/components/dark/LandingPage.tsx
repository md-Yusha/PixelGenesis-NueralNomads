import { Key, Shield, Zap, ArrowRight, CheckCircle2, Fingerprint, Lock, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Decentralized Identity',
      description: 'Your identity, your control. No central authority needed.',
    },
    {
      icon: Lock,
      title: 'Secure Credentials',
      description: 'Blockchain-backed verifiable credentials stored safely.',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verify credentials in seconds with cryptographic proof.',
    },
    {
      icon: Globe,
      title: 'Universal Access',
      description: 'Use your digital identity anywhere, anytime.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Link your Web3 wallet to create your decentralized identity',
      icon: Key,
    },
    {
      number: '02',
      title: 'Create DID',
      description: 'Generate your unique Decentralized Identifier on blockchain',
      icon: Fingerprint,
    },
    {
      number: '03',
      title: 'Manage Credentials',
      description: 'Issue, receive, and verify digital credentials securely',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 overflow-y-auto custom-scrollbar">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-pixel-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-cyan-950/20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo */}
          <div className="inline-block mb-8 p-6 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl pixel-corners glow-purple animate-pulse-slow">
            <Key className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h1 className="pixel-text text-5xl md:text-7xl mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
            PIXELLOCKER
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 font-mono">
            DECENTRALIZED IDENTITY PLATFORM
          </p>
          
          {/* Description */}
          <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-sm md:text-base leading-relaxed">
            Take control of your digital identity with blockchain-powered verifiable credentials.
            Secure, private, and truly yours.
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white pixel-text text-sm rounded-lg pixel-corners transition-all duration-300 hover:scale-105 glow-purple"
          >
            GET STARTED
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg pixel-corners hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-block p-3 bg-indigo-600/20 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="pixel-text text-xs mb-2 text-indigo-400">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="pixel-text text-3xl md:text-5xl mb-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              HOW IT WORKS
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started with your decentralized identity in three simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-[60px] top-[120px] w-0.5 h-20 bg-gradient-to-b from-indigo-500 to-transparent" />
                )}

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 md:p-8 bg-[#1a1a1a] border border-gray-800 rounded-lg pixel-corners hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg pixel-corners glow-purple">
                      <span className="pixel-text text-2xl text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-6 h-6 text-indigo-400" />
                      <h3 className="pixel-text text-lg md:text-xl text-indigo-400">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Check Icon */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <div className="inline-block p-8 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/30 rounded-lg pixel-corners">
              <p className="pixel-text text-sm text-indigo-400 mb-4">
                READY TO START?
              </p>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white pixel-text text-sm rounded-lg pixel-corners transition-all duration-300 hover:scale-105 glow-purple"
              >
                CONNECT WALLET
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            POWERED BY BLOCKCHAIN TECHNOLOGY
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Secure • Private • Decentralized
          </p>
        </div>
      </footer>
    </div>
  );
}
