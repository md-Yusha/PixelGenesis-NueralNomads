import { PixelCard } from '../ui/PixelCard';
import { SmallChip } from '../ui/SmallChip';
import { PixelButton } from '../ui/PixelButton';
import { Wallet, Shield, Plus, ExternalLink, Copy, Key, Award, Users, CheckCircle2, Download } from 'lucide-react';

interface HomeScreenProps {
  userRole: 'holder' | 'issuer' | 'verifier';
}

export function HomeScreen({ userRole: _userRole }: HomeScreenProps) {
  const mockDID = 'did:pixel:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const mockWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="pixel-text text-lg text-[#10B981] mb-2">GOOD MORNING, HOLDER</h1>
        <p className="pixel-text text-xs text-[#888]">Here's your credential overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Credentials', value: '12', icon: Award, color: '#4F46E5', change: '+2 this week' },
          { label: 'Active', value: '10', icon: CheckCircle2, color: '#10B981', change: '83% of total' },
          { label: 'Verifications', value: '48', icon: Shield, color: '#06B6D4', change: '+12 this month' },
          { label: 'Issuers', value: '5', icon: Users, color: '#EF4444', change: 'From 5 orgs' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners hover:border-[#4F46E5] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="pixel-text text-xs text-[#888]">{stat.label}</div>
                <Icon className="w-5 h-5" style={{ color: stat.color }} strokeWidth={3} />
              </div>
              <div className="pixel-text text-2xl text-white mb-2">{stat.value}</div>
              <div className="pixel-text text-[8px] text-[#555]">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* DID & Wallet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixelCard>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-[#4F46E5]" strokeWidth={3} />
                  <span className="pixel-text text-xs text-white">DECENTRALIZED ID</span>
                </div>
                <SmallChip 
                  label={mockDID}
                  color="#4F46E5"
                  onCopy={() => navigator.clipboard.writeText(mockDID)}
                />
                <div className="flex gap-2 pt-2">
                  <PixelButton variant="secondary" fullWidth>
                    <Download className="w-3 h-3 inline mr-1" />
                    EXPORT
                  </PixelButton>
                </div>
              </div>
            </PixelCard>

            <PixelCard>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#06B6D4]" strokeWidth={3} />
                    <span className="pixel-text text-xs text-white">WALLET</span>
                  </div>
                  <div className="px-2 py-1 bg-[#10B981] pixel-corners">
                    <span className="pixel-text text-[8px] text-black">CONNECTED</span>
                  </div>
                </div>
                <SmallChip 
                  label={mockWallet}
                  icon={<Wallet className="w-3 h-3" />}
                  color="#06B6D4"
                  onCopy={() => navigator.clipboard.writeText(mockWallet)}
                />
                <div className="pt-2 border-t-2 border-[#1a1a1a]">
                  <div className="flex items-center justify-between">
                    <span className="pixel-text text-[10px] text-[#888]">Network</span>
                    <div className="px-2 py-1 bg-[#1a1a1a] border-2 border-[#4F46E5] pixel-corners">
                      <span className="pixel-text text-[8px] text-[#4F46E5]">SEPOLIA</span>
                    </div>
                  </div>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Active Credentials */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="pixel-text text-sm text-[#06B6D4]">ACTIVE CREDENTIALS</h2>
              <button className="pixel-text text-xs text-[#888] hover:text-[#4F46E5]">
                VIEW ALL →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Aadhaar KYC', issuer: 'UIDAI', color: '#10B981', issued: '2025-01-15' },
                { title: 'College ID', issuer: 'MIT', color: '#4F46E5', issued: '2024-09-01' },
                { title: 'Work Pass', issuer: 'TechCorp', color: '#06B6D4', issued: '2024-01-01' },
              ].map((cred, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners hover:border-[#4F46E5] transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 pixel-corners flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cred.color }}>
                      <Award className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="pixel-text text-xs text-white mb-1 truncate">{cred.title}</div>
                      <div className="pixel-text text-[10px] text-[#888] mb-2">{cred.issuer}</div>
                      <div className="pixel-text text-[8px] text-[#555]">Issued: {cred.issued}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <PixelCard>
            <div className="pixel-text text-xs text-[#888] mb-4">QUICK ACTIONS</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="p-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
                <Plus className="w-6 h-6 mx-auto mb-2 text-[#4F46E5]" strokeWidth={3} />
                <div className="pixel-text text-[8px] text-white">Issue</div>
              </button>
              <button className="p-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#06B6D4] transition-colors">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#06B6D4]" strokeWidth={3} />
                <div className="pixel-text text-[8px] text-white">Verify</div>
              </button>
              <button className="p-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#10B981] transition-colors">
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-[#10B981]" strokeWidth={3} />
                <div className="pixel-text text-[8px] text-white">Export</div>
              </button>
              <button className="p-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#EF4444] transition-colors">
                <Copy className="w-6 h-6 mx-auto mb-2 text-[#EF4444]" strokeWidth={3} />
                <div className="pixel-text text-[8px] text-white">Backup</div>
              </button>
            </div>
          </PixelCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <PixelCard>
            <div className="flex items-center justify-between mb-4">
              <span className="pixel-text text-xs text-[#888]">RECENT ACTIVITY</span>
              <Shield className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="space-y-3">
              {[
                { action: 'KYC verified by Bank', time: '2h ago', status: 'success' },
                { action: 'College ID issued', time: '1d ago', status: 'success' },
                { action: 'Work Pass verified', time: '2d ago', status: 'success' },
                { action: 'DID exported', time: '3d ago', status: 'success' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a] first:border-t-0">
                  <div className="flex-1">
                    <div className="pixel-text text-[10px] text-white mb-1">{item.action}</div>
                    <div className="pixel-text text-[8px] text-[#888]">{item.time}</div>
                  </div>
                  <div className="w-2 h-2 bg-[#10B981]"></div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 pixel-text text-xs text-[#4F46E5] hover:text-[#06B6D4]">
              VIEW ALL →
            </button>
          </PixelCard>

          {/* Network Stats */}
          <PixelCard>
            <div className="pixel-text text-xs text-[#888] mb-4">NETWORK STATS</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="pixel-text text-[10px] text-[#888]">Gas Price</span>
                <span className="pixel-text text-[10px] text-[#10B981]">12 GWEI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="pixel-text text-[10px] text-[#888]">Block Number</span>
                <span className="pixel-text text-[10px] text-white">4,567,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="pixel-text text-[10px] text-[#888]">Active DIDs</span>
                <span className="pixel-text text-[10px] text-[#06B6D4]">1,234</span>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </div>
  );
}