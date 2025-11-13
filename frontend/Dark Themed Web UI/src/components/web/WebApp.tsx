import { useState } from 'react';
import { WebSidebar } from './WebSidebar';
import { WebTopBar } from './WebTopBar';
import { HomeScreen } from '../screens/web/HomeScreen';
import { CredentialsScreen } from '../screens/web/CredentialsScreen';
import { ScanVerifyScreen } from '../screens/web/ScanVerifyScreen';
import { ActivityScreen } from '../screens/web/ActivityScreen';
import { ProfileScreen } from '../screens/web/ProfileScreen';

type Screen = 'home' | 'credentials' | 'scan' | 'activity' | 'profile';

interface WebAppProps {
  userRole: 'holder' | 'issuer' | 'verifier';
  onLogout: () => void;
}

export function WebApp({ userRole, onLogout }: WebAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const getScreenTitle = () => {
    const titles = {
      home: 'Dashboard',
      credentials: 'Credentials',
      scan: 'Scan & Verify',
      activity: 'Activity',
      profile: 'Profile',
    };
    return titles[currentScreen];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <WebSidebar
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onLogout={onLogout}
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <WebTopBar
          title={getScreenTitle()}
          userRole={userRole}
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
          {currentScreen === 'home' && <HomeScreen userRole={userRole} />}
          {currentScreen === 'credentials' && <CredentialsScreen userRole={userRole} />}
          {currentScreen === 'scan' && <ScanVerifyScreen />}
          {currentScreen === 'activity' && <ActivityScreen />}
          {currentScreen === 'profile' && <ProfileScreen onLogout={onLogout} />}
        </div>
      </div>
    </div>
  );
}
