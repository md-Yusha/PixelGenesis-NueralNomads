import { Home, FileText, ScanLine, Bell, User, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, Key } from 'lucide-react';

type Screen = 'home' | 'credentials' | 'scan' | 'activity' | 'profile';

interface WebSidebarProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onLogout: () => void;
  userRole: 'holder' | 'issuer' | 'verifier';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function WebSidebar({ 
  currentScreen, 
  onScreenChange, 
  onLogout, 
  userRole,
  isCollapsed,
  onToggleCollapse
}: WebSidebarProps) {
  const menuItems = [
    { id: 'home' as Screen, icon: Home, label: 'Dashboard' },
    { id: 'credentials' as Screen, icon: FileText, label: 'Credentials' },
    { id: 'scan' as Screen, icon: ScanLine, label: 'Scan & Verify' },
    { id: 'activity' as Screen, icon: Bell, label: 'Activity' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <div 
      className={`bg-[#0f0f0f] border-r-4 border-[#2a2a2a] flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo & Collapse */}
      <div className="p-6 border-b-4 border-[#2a2a2a] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center">
              <Key className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="pixel-text text-sm text-[#4F46E5]">PIXEL</div>
              <div className="pixel-text text-[8px] text-[#888]">LOCKER</div>
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-[#1a1a1a] pixel-corners transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#888]" />
          )}
        </button>
      </div>

      {/* Profile Card */}
      {!isCollapsed && (
        <div className="p-4 border-b-4 border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center">
              <User className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="pixel-text text-xs text-white truncate">HOLDER_01</div>
              <div className="pixel-text text-[8px] text-[#888] mt-1">holder@pixel.id</div>
            </div>
          </div>
          <div className="px-2 py-1 bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners inline-block">
            <span className="pixel-text text-[8px] text-[#10B981]">{userRole.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`w-full flex items-center gap-3 p-3 pixel-corners transition-all ${
                  isActive
                    ? 'bg-[#4F46E5] border-2 border-[#4F46E5]'
                    : 'hover:bg-[#1a1a1a] border-2 border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon 
                  className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#888]'} ${
                    isCollapsed ? 'mx-auto' : ''
                  }`}
                  strokeWidth={3}
                />
                {!isCollapsed && (
                  <span className={`pixel-text text-xs ${isActive ? 'text-white' : 'text-[#888]'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isCollapsed && (
          <>
            <div className="h-px bg-[#2a2a2a] my-3" />

            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners border-2 border-transparent transition-all">
                <Settings className="w-5 h-5 text-[#888]" strokeWidth={3} />
                <span className="pixel-text text-xs text-[#888]">Settings</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1a1a] pixel-corners border-2 border-transparent transition-all">
                <HelpCircle className="w-5 h-5 text-[#888]" strokeWidth={3} />
                <span className="pixel-text text-xs text-[#888]">Help & Docs</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t-4 border-[#2a2a2a]">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-2 p-3 bg-[#EF4444] border-4 border-[#EF4444] pixel-corners hover:bg-[#DC2626] transition-all ${
            isCollapsed ? 'justify-center' : 'justify-center'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 text-white" strokeWidth={3} />
          {!isCollapsed && (
            <span className="pixel-text text-xs text-white">LOGOUT</span>
          )}
        </button>
      </div>
    </div>
  );
}
