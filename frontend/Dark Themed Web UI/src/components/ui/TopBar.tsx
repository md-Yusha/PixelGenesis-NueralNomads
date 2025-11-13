import { Menu, Wifi } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  onBack?: () => void;
}

export function TopBar({ title, onMenuClick, onBack }: TopBarProps) {
  return (
    <div className="h-14 bg-[#0f0f0f] border-b-4 border-[#2a2a2a] flex items-center justify-between px-4 pixel-corners">
      <button 
        onClick={onBack || onMenuClick}
        className="p-2 hover:bg-[#1a1a1a] pixel-corners"
      >
        <Menu className="w-5 h-5 text-[#888]" strokeWidth={3} />
      </button>
      
      <h1 className="pixel-text text-sm text-white">{title}</h1>
      
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners flex items-center gap-1">
          <Wifi className="w-3 h-3 text-[#10B981]" />
          <span className="pixel-text text-[8px] text-[#10B981]">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
