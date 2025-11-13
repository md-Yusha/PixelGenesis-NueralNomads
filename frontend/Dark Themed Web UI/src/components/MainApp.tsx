import { useState } from 'react';
import { TopBar } from './ui/TopBar';
import { BottomTabBar } from './ui/BottomTabBar';
import { Drawer } from './ui/Drawer';
import { HomeScreen } from './screens/HomeScreen';
import { CredentialsScreen } from './screens/CredentialsScreen';
import { ScanVerifyScreen } from './screens/ScanVerifyScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ProfileScreen } from './screens/ProfileScreen';

type Tab = 'home' | 'credentials' | 'scan' | 'activity' | 'profile';

interface MainAppProps {
  userRole: 'holder' | 'issuer' | 'verifier';
  onLogout: () => void;
}

export function MainApp({ userRole, onLogout }: MainAppProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getScreenTitle = () => {
    const titles = {
      home: 'HOME',
      credentials: 'CREDENTIALS',
      scan: 'SCAN & VERIFY',
      activity: 'ACTIVITY',
      profile: 'PROFILE',
    };
    return titles[currentTab];
  };

  return (
    <>
      {/* Drawer */}
      {isDrawerOpen && (
        <Drawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            setIsDrawerOpen(false);
          }}
          onLogout={onLogout}
          userRole={userRole}
        />
      )}

      {/* Top Bar */}
      <TopBar 
        title={getScreenTitle()}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {currentTab === 'home' && <HomeScreen userRole={userRole} />}
        {currentTab === 'credentials' && <CredentialsScreen userRole={userRole} />}
        {currentTab === 'scan' && <ScanVerifyScreen />}
        {currentTab === 'activity' && <ActivityScreen />}
        {currentTab === 'profile' && <ProfileScreen onLogout={onLogout} />}
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole={userRole}
      />
    </>
  );
}
