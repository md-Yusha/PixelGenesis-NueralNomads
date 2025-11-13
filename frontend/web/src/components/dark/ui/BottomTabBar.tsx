import { Home, FileText, ScanLine, Bell, User } from 'lucide-react';

type Tab = 'home' | 'credentials' | 'scan' | 'activity' | 'profile';

interface BottomTabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  const tabs = [
    { id: 'home' as Tab, icon: Home, label: 'Home' },
    { id: 'credentials' as Tab, icon: FileText, label: 'Creds' },
    { id: 'scan' as Tab, icon: ScanLine, label: 'Scan', isCenter: true },
    { id: 'activity' as Tab, icon: Bell, label: 'Activity' },
    { id: 'profile' as Tab, icon: User, label: 'Profile' },
  ];

  return (
    <div className="h-20 bg-[#0f0f0f] border-t-4 border-[#2a2a2a] flex items-center justify-around px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        if (tab.isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative -mt-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center hover:scale-105 transition-transform">
                <Icon className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </button>
          );
        }
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${
              isActive 
                ? 'text-[#4F46E5]' 
                : 'text-[#4a4a4a] hover:text-[#06B6D4]'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={3} />
            <span className="pixel-text text-[8px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
