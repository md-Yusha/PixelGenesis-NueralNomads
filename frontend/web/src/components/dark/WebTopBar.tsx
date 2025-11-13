import { Menu, Wifi, Bell, Search, Wallet } from 'lucide-react';
import { SmallChip } from './ui/SmallChip';

// Web top navigation bar component
interface WebTopBarProps {
  title: string;
  userRole: 'holder' | 'issuer' | 'verifier';
  onMenuClick: () => void;
}

export function WebTopBar({ title, onMenuClick }: WebTopBarProps) {
  const mockWallet = '0x742d...f0bEb';

  return (
    <div className="h-16 bg-[#0f0f0f] border-b-4 border-[#2a2a2a] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-[#1a1a1a] pixel-corners lg:hidden"
        >
          <Menu className="w-5 h-5 text-[#888]" strokeWidth={3} />
        </button>
        <h1 className="pixel-text text-sm text-white">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] border-2 border-[#2a2a2a] pixel-corners px-3 py-2 w-64">
          <Search className="w-4 h-4 text-[#888]" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent pixel-text text-xs text-white placeholder:text-[#555] outline-none"
          />
        </div>

        {/* Wallet */}
        <SmallChip 
          label={mockWallet}
          icon={<Wallet className="w-3 h-3" />}
          color="#06B6D4"
        />

        {/* Network Status */}
        <div className="hidden sm:flex px-3 py-1 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners items-center gap-2">
          <Wifi className="w-3 h-3 text-[#10B981]" />
          <span className="pixel-text text-[8px] text-[#10B981]">SEPOLIA</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#1a1a1a] pixel-corners">
          <Bell className="w-5 h-5 text-[#888]" strokeWidth={3} />
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></div>
        </button>
      </div>
    </div>
  );
}

