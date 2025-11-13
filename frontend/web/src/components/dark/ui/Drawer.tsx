import { Home, FileText, ScanLine, Bell, User, Settings, HelpCircle, LogOut, Code } from 'lucide-react';
import { SmallChip } from './SmallChip';

type Tab = 'home' | 'credentials' | 'scan' | 'activity' | 'profile';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
  onLogout: () => void;
  userRole: 'holder' | 'issuer' | 'verifier';
}

export function Drawer({ isOpen, onClose, onNavigate, onLogout, userRole }: DrawerProps) {
  const menuItems = [
    { id: 'home' as Tab, icon: Home, label: 'Home' },
    { id: 'credentials' as Tab, icon: FileText, label: 'Credentials' },
    { id: 'scan' as Tab, icon: ScanLine, label: 'Scan & Verify' },
    { id: 'activity' as Tab, icon: Bell, label: 'Activity' },
    { id: 'profile' as Tab, icon: User, label: 'Profile' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0f0f0f] border-r-4 border-[#2a2a2a] z-50 flex flex-col">
        {/* Profile Card */}
        <div className="p-4 border-b-4 border-[#2a2a2a]">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center">
            <User className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <div className="text-center mb-2">
            <div className="pixel-text text-xs text-white mb-1">HOLDER_01</div>
            <div className="px-2 py-1 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners inline-block">
              <span className="pixel-text text-[8px] text-[#10B981]">{userRole.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <SmallChip 
              label="0x742d...f0bEb"
              color="#4F46E5"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#888]" strokeWidth={3} />
                  <span className="pixel-text text-xs text-white">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-[#2a2a2a] my-2" />

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors">
              <Settings className="w-5 h-5 text-[#888]" strokeWidth={3} />
              <span className="pixel-text text-xs text-white">Settings</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors">
              <HelpCircle className="w-5 h-5 text-[#888]" strokeWidth={3} />
              <span className="pixel-text text-xs text-white">Help & Docs</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners transition-colors">
              <Code className="w-5 h-5 text-[#888]" strokeWidth={3} />
              <span className="pixel-text text-xs text-white">Developer</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t-4 border-[#2a2a2a]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[#EF4444] border-4 border-[#EF4444] pixel-corners hover:bg-[#DC2626] transition-colors"
          >
            <LogOut className="w-4 h-4 text-white" strokeWidth={3} />
            <span className="pixel-text text-xs text-white">LOGOUT</span>
          </button>
        </div>
      </div>
    </>
  );
}
