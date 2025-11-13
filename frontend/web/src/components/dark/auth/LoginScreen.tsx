import { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { FormField } from '../ui/FormField';
import { Key, Wallet, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'holder' | 'issuer' | 'verifier') => void;
  onNavigateToRegister: () => void;
  isWeb?: boolean;
}

export function LoginScreen({ onLogin, onNavigateToRegister, isWeb = false }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login - default to holder role
    onLogin('holder');
  };

  const containerClass = isWeb 
    ? 'min-h-screen flex items-center justify-center p-8'
    : 'flex-1 flex flex-col bg-[#0f0f0f] p-4';

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`text-center ${isWeb ? 'mb-8' : 'pt-12 pb-8'}`}>
        <div className={`${isWeb ? 'w-24 h-24' : 'w-20 h-20'} mx-auto bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center mb-4`}>
          <Key className={`${isWeb ? 'w-12 h-12' : 'w-10 h-10'} text-white`} strokeWidth={3} />
        </div>
        <h1 className={`pixel-text text-[#4F46E5] ${isWeb ? 'text-2xl' : 'text-xl'} mb-2`}>PIXELGENESIS</h1>
        <p className="pixel-text text-[#888] text-xs">Decentralized ID</p>
      </div>

      {/* Login Form */}
      <div className={`space-y-4 ${isWeb ? 'w-full max-w-md' : 'flex-1'}`}>
        <PixelCard>
          <div className="space-y-4">
            <div className="pixel-text text-[#06B6D4] text-sm mb-4">LOGIN</div>
            
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="holder@pixel.id"
              icon={<Mail className="w-4 h-4" />}
            />

            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={<Key className="w-4 h-4" />}
            />

            <button className="pixel-text text-xs text-[#06B6D4] hover:text-[#4F46E5]">
              Forgot password?
            </button>
          </div>
        </PixelCard>

        <PixelButton variant="primary" fullWidth onClick={handleLogin}>
          LOGIN
        </PixelButton>

        <PixelButton variant="secondary" fullWidth>
          <Wallet className="w-4 h-4 inline mr-2" />
          CONNECT WALLET
        </PixelButton>

        <div className="text-center pt-4">
          <span className="pixel-text text-[10px] text-[#888]">New user? </span>
          <button 
            onClick={onNavigateToRegister}
            className="pixel-text text-[10px] text-[#4F46E5] hover:text-[#06B6D4]"
          >
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
}
