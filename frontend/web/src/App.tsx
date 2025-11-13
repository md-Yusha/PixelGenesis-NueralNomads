import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WebApp } from './components/dark/WebApp';
import { LandingPage } from './components/dark/LandingPage';
import { Key } from 'lucide-react';

function App() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [userRole] = useState<'holder' | 'issuer' | 'verifier'>('holder');
  const [showLanding, setShowLanding] = useState(true);

  const handleLogout = () => {
    disconnect();
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show dashboard when wallet is connected
  if (isConnected) {
    return <WebApp userRole={userRole} onLogout={handleLogout} />;
  }

  // Show wallet connect screen when not connected
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center mb-4">
            <Key className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="pixel-text text-[#4F46E5] text-2xl mb-2">PIXELLOCKER</h1>
          <p className="pixel-text text-[#888] text-xs">Decentralized Identity Platform</p>
        </div>

        {/* Connect Wallet Card */}
        <div className="bg-[#0f0f0f] border-4 border-[#2a2a2a] p-6 pixel-corners space-y-4">
          <div className="pixel-text text-[#06B6D4] text-sm mb-4">CONNECT WALLET</div>
          <p className="pixel-text text-[10px] text-[#888] leading-relaxed mb-6">
            Connect your wallet to access<br/>
            your decentralized identity<br/>
            and credentials dashboard
          </p>
          
          {/* RainbowKit Connect Button */}
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <div className="pixel-text text-[8px] text-[#888]">
            Powered by blockchain technology
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

