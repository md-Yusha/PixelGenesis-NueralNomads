import { PixelCard } from '../ui/PixelCard';
import { SmallChip } from '../ui/SmallChip';
import { PixelButton } from '../ui/PixelButton';
import { Wallet, Shield, Plus, ExternalLink, Copy, Key, Award } from 'lucide-react';

interface HomeScreenProps {
  userRole: 'holder' | 'issuer' | 'verifier';
}

export function HomeScreen({ userRole }: HomeScreenProps) {
  const mockDID = 'did:pixel:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const mockWallet = '0x742d...f0bEb';

  return (
    <div className="p-4 space-y-4 bg-[#0f0f0f]">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="pixel-text text-[#10B981]">GM, HOLDER</h1>
        <div className="flex flex-wrap gap-2">
          <SmallChip 
            label={mockDID}
            icon={<Key className="w-3 h-3" />}
            color="#4F46E5"
            onCopy={() => navigator.clipboard.writeText(mockDID)}
          />
        </div>
      </div>

      {/* Wallet Card */}
      <PixelCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#06B6D4]" strokeWidth={3} />
            <span className="pixel-text text-xs text-white">WALLET</span>
          </div>
          <div className="px-2 py-1 bg-[#10B981] pixel-corners">
            <span className="pixel-text text-[8px] text-black">CONNECTED</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="pixel-text text-xs text-[#888]">{mockWallet}</span>
          <button className="p-1">
            <Copy className="w-4 h-4 text-[#888] hover:text-[#4F46E5]" />
          </button>
        </div>
        <div className="mt-3 pt-3 border-t-2 border-[#2a2a2a] flex items-center justify-between">
          <span className="pixel-text text-[10px] text-[#888]">Network</span>
          <div className="px-2 py-1 bg-[#1a1a1a] border-2 border-[#4F46E5] pixel-corners">
            <span className="pixel-text text-[8px] text-[#4F46E5]">SEPOLIA</span>
          </div>
        </div>
      </PixelCard>

      {/* Active Credentials */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="pixel-text text-xs text-[#06B6D4]">ACTIVE CREDENTIALS</h2>
          <button className="pixel-text text-[10px] text-[#888] hover:text-[#4F46E5]">
            VIEW ALL →
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { title: 'Aadhaar KYC', issuer: 'UIDAI', color: '#10B981' },
            { title: 'College ID', issuer: 'MIT', color: '#4F46E5' },
            { title: 'Work Pass', issuer: 'TechCorp', color: '#06B6D4' },
          ].map((cred, idx) => (
            <div
              key={idx}
              className="min-w-[140px] bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners hover:border-[#4F46E5] transition-colors"
            >
              <div className="w-8 h-8 mb-2 pixel-corners flex items-center justify-center" style={{ backgroundColor: cred.color }}>
                <Award className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div className="pixel-text text-[10px] text-white mb-1">{cred.title}</div>
              <div className="pixel-text text-[8px] text-[#888]">{cred.issuer}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <PixelCard>
        <div className="flex items-center justify-between mb-3">
          <span className="pixel-text text-xs text-[#888]">RECENT VERIFICATIONS</span>
          <Shield className="w-4 h-4 text-[#10B981]" />
        </div>
        <div className="space-y-2">
          {[
            { action: 'Bank verified KYC', time: '2h ago', status: 'success' },
            { action: 'Hotel checked Work Pass', time: '1d ago', status: 'success' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a] first:border-t-0">
              <div>
                <div className="pixel-text text-[10px] text-white">{item.action}</div>
                <div className="pixel-text text-[8px] text-[#888] mt-1">{item.time}</div>
              </div>
              <div className="w-2 h-2 bg-[#10B981]"></div>
            </div>
          ))}
        </div>
      </PixelCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <PixelButton variant="secondary" fullWidth>
          <Plus className="w-4 h-4 inline mr-1" />
          BACKUP
        </PixelButton>
        <PixelButton variant="secondary" fullWidth>
          <ExternalLink className="w-4 h-4 inline mr-1" />
          EXPORT
        </PixelButton>
      </div>
    </div>
  );
}
