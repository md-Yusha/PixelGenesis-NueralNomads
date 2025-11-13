import { useState } from 'react';
import { AuthStack } from './components/auth/AuthStack';
import { WebApp } from './components/web/WebApp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'holder' | 'issuer' | 'verifier'>('holder');

  const handleLogin = (role: 'holder' | 'issuer' | 'verifier') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {!isAuthenticated ? (
        <AuthStack onLogin={handleLogin} isWeb={true} />
      ) : (
        <WebApp userRole={userRole} onLogout={handleLogout} />
      )}
    </div>
  );
}
