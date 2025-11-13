import { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { FormField } from '../ui/FormField';
import { Mail, Key, User, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface RegisterScreenProps {
  onRegisterComplete: (role: 'holder' | 'issuer' | 'verifier') => void;
  onNavigateToLogin: () => void;
  isWeb?: boolean;
}

export function RegisterScreen({ onRegisterComplete, onNavigateToLogin, isWeb = false }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'holder' | 'issuer' | 'verifier'>('holder');

  const roles = [
    { id: 'holder' as const, label: 'Holder', icon: User, color: '#10B981', desc: 'Store & share credentials' },
    { id: 'issuer' as const, label: 'Issuer', icon: FileText, color: '#4F46E5', desc: 'Issue verifiable credentials' },
    { id: 'verifier' as const, label: 'Verifier', icon: Shield, color: '#06B6D4', desc: 'Verify credentials' },
  ];

  const handleRegister = () => {
    onRegisterComplete(selectedRole);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] p-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="pixel-text text-[#4F46E5] text-xl mb-2">CREATE ACCOUNT</h1>
        <p className="pixel-text text-[#888] text-xs">Join the DID network</p>
      </div>

      {/* Form */}
      <div className="space-y-4 pb-4">
        <PixelCard>
          <div className="space-y-4">
            <div className="pixel-text text-[#06B6D4] text-xs mb-3">SELECT ROLE</div>
            
            <div className="space-y-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-3 border-4 pixel-corners transition-all ${
                      isSelected
                        ? 'bg-[#1a1a1a] border-[#4F46E5]'
                        : 'bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: role.color }}
                        strokeWidth={3}
                      />
                      <div className="flex-1 text-left">
                        <div className="pixel-text text-xs text-white">{role.label}</div>
                        <div className="pixel-text text-[8px] text-[#888] mt-1">{role.desc}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </PixelCard>

        <PixelCard>
          <div className="space-y-4">
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@pixel.id"
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
          </div>
        </PixelCard>

        <PixelButton variant="primary" fullWidth onClick={handleRegister}>
          CREATE ACCOUNT
        </PixelButton>

        <div className="text-center pt-2">
          <span className="pixel-text text-[10px] text-[#888]">Have an account? </span>
          <button 
            onClick={onNavigateToLogin}
            className="pixel-text text-[10px] text-[#4F46E5] hover:text-[#06B6D4]"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
