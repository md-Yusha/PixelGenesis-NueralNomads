import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { SmallChip } from '../ui/SmallChip';
import { User, Wallet, Key, Shield, Download, RotateCw, ChevronRight, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const mockDID = 'did:pixel:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const mockWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const settingsSections = [
    {
      title: 'WALLET MANAGEMENT',
      items: [
        { icon: Wallet, label: 'Connected Wallets', value: '1 wallet' },
        { icon: Key, label: 'Private Keys', value: 'Secure' },
      ],
    },
    {
      title: 'DID MANAGEMENT',
      items: [
        { icon: Download, label: 'Backup DID', value: null },
        { icon: RotateCw, label: 'Rotate Keys', value: null },
        { icon: Download, label: 'Export DID Document', value: null },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { icon: Shield, label: 'Backup Phrase', value: 'Not saved' },
        { icon: Shield, label: 'Biometric Auth', value: 'Enabled' },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-[#0f0f0f] pb-24">
      {/* Profile Header */}
      <PixelCard>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center">
            <User className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <div className="flex-1">
            <div className="pixel-text text-sm text-white mb-1">HOLDER_01</div>
            <div className="pixel-text text-[10px] text-[#888] mb-3">holder@pixel.id</div>
            <div className="px-3 py-1 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners inline-block">
              <span className="pixel-text text-[8px] text-[#10B981]">HOLDER</span>
            </div>
          </div>
        </div>
      </PixelCard>

      {/* DID Card */}
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
          <div className="pt-3 border-t-2 border-[#1a1a1a] flex gap-2">
            <PixelButton variant="secondary" fullWidth>
              <Download className="w-3 h-3 inline mr-1" />
              EXPORT
            </PixelButton>
            <PixelButton variant="secondary" fullWidth>
              <Key className="w-3 h-3 inline mr-1" />
              VIEW
            </PixelButton>
          </div>
        </div>
      </PixelCard>

      {/* Connected Wallet */}
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
          <div className="pt-3 border-t-2 border-[#1a1a1a]">
            <PixelButton variant="danger" fullWidth>
              DISCONNECT
            </PixelButton>
          </div>
        </div>
      </PixelCard>

      {/* Settings Sections */}
      {settingsSections.map((section, idx) => (
        <div key={idx} className="space-y-2">
          <div className="pixel-text text-[10px] text-[#888]">{section.title}</div>
          <PixelCard>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIdx}
                    className="w-full flex items-center justify-between p-2 hover:bg-[#1a1a1a] pixel-corners transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#888]" strokeWidth={3} />
                      <span className="pixel-text text-[10px] text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="pixel-text text-[8px] text-[#888]">{item.value}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#888]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </PixelCard>
        </div>
      ))}

      {/* Developer Options */}
      <div className="space-y-2">
        <div className="pixel-text text-[10px] text-[#888]">DEVELOPER</div>
        <PixelCard>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-2 hover:bg-[#1a1a1a] pixel-corners transition-colors">
              <span className="pixel-text text-[10px] text-white">Switch Network</span>
              <ChevronRight className="w-4 h-4 text-[#888]" />
            </button>
            <button className="w-full flex items-center justify-between p-2 hover:bg-[#1a1a1a] pixel-corners transition-colors">
              <span className="pixel-text text-[10px] text-white">View Logs</span>
              <ChevronRight className="w-4 h-4 text-[#888]" />
            </button>
          </div>
        </PixelCard>
      </div>

      {/* Logout */}
      <PixelButton variant="danger" fullWidth onClick={onLogout}>
        <LogOut className="w-4 h-4 inline mr-2" />
        LOGOUT
      </PixelButton>

      {/* App Info */}
      <div className="text-center pt-4">
        <div className="pixel-text text-[8px] text-[#888]">PixelGenesis v1.0.0</div>
        <div className="pixel-text text-[8px] text-[#888] mt-1">© 2025 Decentralized ID</div>
      </div>
    </div>
  );
}
