import { PixelCard } from '../../ui/PixelCard';
import { PixelButton } from '../../ui/PixelButton';
import { SmallChip } from '../../ui/SmallChip';
import { User, Wallet, Key, Shield, Download, RotateCw, ChevronRight, LogOut, Settings, Bell } from 'lucide-react';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const mockDID = 'did:pixel:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const mockWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="pixel-text text-lg text-white mb-2">PROFILE & SETTINGS</h1>
        <p className="pixel-text text-xs text-[#888]">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <PixelCard>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center">
                <User className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <div className="pixel-text text-sm text-white mb-2">HOLDER_01</div>
              <div className="pixel-text text-xs text-[#888] mb-4">holder@pixel.id</div>
              <div className="px-3 py-2 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners inline-block">
                <span className="pixel-text text-xs text-[#10B981]">HOLDER</span>
              </div>
            </div>
          </PixelCard>

          {/* Quick Stats */}
          <PixelCard>
            <div className="pixel-text text-xs text-[#888] mb-4">ACCOUNT STATS</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                <span className="pixel-text text-xs text-[#888]">Member Since</span>
                <span className="pixel-text text-xs text-white">Jan 2025</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                <span className="pixel-text text-xs text-[#888]">Credentials</span>
                <span className="pixel-text text-xs text-[#10B981]">12</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="pixel-text text-xs text-[#888]">Verifications</span>
                <span className="pixel-text text-xs text-[#06B6D4]">48</span>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Middle & Right: Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* DID Management */}
          <div>
            <div className="pixel-text text-sm text-[#888] mb-4">DECENTRALIZED IDENTITY</div>
            <PixelCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#4F46E5]" strokeWidth={3} />
                  <span className="pixel-text text-xs text-white">DID DOCUMENT</span>
                </div>
                <SmallChip 
                  label={mockDID}
                  color="#4F46E5"
                  onCopy={() => navigator.clipboard.writeText(mockDID)}
                />
                <div className="grid grid-cols-3 gap-3 pt-3 border-t-2 border-[#1a1a1a]">
                  <PixelButton variant="secondary" fullWidth>
                    <Download className="w-3 h-3 inline mr-1" />
                    BACKUP
                  </PixelButton>
                  <PixelButton variant="secondary" fullWidth>
                    <RotateCw className="w-3 h-3 inline mr-1" />
                    ROTATE
                  </PixelButton>
                  <PixelButton variant="secondary" fullWidth>
                    <Download className="w-3 h-3 inline mr-1" />
                    EXPORT
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Wallet Management */}
          <div>
            <div className="pixel-text text-sm text-[#888] mb-4">WALLET MANAGEMENT</div>
            <PixelCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#06B6D4]" strokeWidth={3} />
                    <span className="pixel-text text-xs text-white">CONNECTED WALLET</span>
                  </div>
                  <div className="px-2 py-1 bg-[#10B981] pixel-corners">
                    <span className="pixel-text text-[8px] text-black">ACTIVE</span>
                  </div>
                </div>
                <SmallChip 
                  label={mockWallet}
                  icon={<Wallet className="w-3 h-3" />}
                  color="#06B6D4"
                  onCopy={() => navigator.clipboard.writeText(mockWallet)}
                />
                <div className="flex items-center justify-between pt-3 border-t-2 border-[#1a1a1a]">
                  <span className="pixel-text text-xs text-[#888]">Network</span>
                  <div className="px-3 py-1 bg-[#1a1a1a] border-2 border-[#4F46E5] pixel-corners">
                    <span className="pixel-text text-xs text-[#4F46E5]">SEPOLIA</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PixelButton variant="secondary" fullWidth>
                    ADD WALLET
                  </PixelButton>
                  <PixelButton variant="danger" fullWidth>
                    DISCONNECT
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Security Settings */}
          <div>
            <div className="pixel-text text-sm text-[#888] mb-4">SECURITY & PRIVACY</div>
            <PixelCard>
              <div className="space-y-2">
                {[
                  { icon: Shield, label: 'Two-Factor Authentication', value: 'Enabled' },
                  { icon: Key, label: 'Backup Phrase', value: 'Not Saved' },
                  { icon: Shield, label: 'Biometric Auth', value: 'Enabled' },
                  { icon: Bell, label: 'Notifications', value: 'All' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#888]" strokeWidth={3} />
                        <span className="pixel-text text-xs text-white">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="pixel-text text-xs text-[#888]">{item.value}</span>
                        <ChevronRight className="w-4 h-4 text-[#888]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </PixelCard>
          </div>

          {/* Developer Options */}
          <div>
            <div className="pixel-text text-sm text-[#888] mb-4">ADVANCED</div>
            <PixelCard>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#888]" strokeWidth={3} />
                    <span className="pixel-text text-xs text-white">Developer Mode</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#888]" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors">
                  <span className="pixel-text text-xs text-white">Export Activity Logs</span>
                  <Download className="w-4 h-4 text-[#888]" />
                </button>
              </div>
            </PixelCard>
          </div>

          {/* Danger Zone */}
          <div>
            <div className="pixel-text text-sm text-[#EF4444] mb-4">DANGER ZONE</div>
            <PixelCard>
              <div className="space-y-3">
                <div className="pixel-text text-xs text-[#888] mb-2">
                  These actions cannot be undone
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PixelButton variant="secondary" fullWidth>
                    CLEAR DATA
                  </PixelButton>
                  <PixelButton variant="danger" fullWidth onClick={onLogout}>
                    <LogOut className="w-4 h-4 inline mr-2" />
                    LOGOUT
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    </div>
  );
}
