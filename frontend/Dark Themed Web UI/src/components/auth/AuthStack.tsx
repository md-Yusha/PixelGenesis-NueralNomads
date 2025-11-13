import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { OnboardingFlow } from './OnboardingFlow';

interface AuthStackProps {
  onLogin: (role: 'holder' | 'issuer' | 'verifier') => void;
  isWeb?: boolean;
}

export function AuthStack({ onLogin, isWeb = false }: AuthStackProps) {
  const [screen, setScreen] = useState<'login' | 'register' | 'onboarding'>('login');
  const [userRole, setUserRole] = useState<'holder' | 'issuer' | 'verifier'>('holder');

  const handleRegisterComplete = (role: 'holder' | 'issuer' | 'verifier') => {
    setUserRole(role);
    setScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    onLogin(userRole);
  };

  return (
    <>
      {screen === 'login' && (
        <LoginScreen 
          onLogin={onLogin} 
          onNavigateToRegister={() => setScreen('register')}
          isWeb={isWeb}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen 
          onRegisterComplete={handleRegisterComplete}
          onNavigateToLogin={() => setScreen('login')}
          isWeb={isWeb}
        />
      )}
      {screen === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} isWeb={isWeb} />
      )}
    </>
  );
}
