import { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { Shield, Camera, Bell, Key } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  isWeb?: boolean;
}

export function OnboardingFlow({ onComplete, isWeb = false }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Shield,
      color: '#4F46E5',
      title: 'WELCOME TO\nPIXELGENESIS',
      desc: 'Your decentralized identity\non the blockchain',
    },
    {
      icon: Key,
      color: '#10B981',
      title: 'SECURE YOUR\nPRIVATE KEYS',
      desc: 'Your keys, your identity.\nBackup and protect them.',
    },
    {
      icon: Camera,
      color: '#06B6D4',
      title: 'SCAN & VERIFY\nCREDENTIALS',
      desc: 'Grant camera access to\nscan QR codes.',
    },
    {
      icon: Bell,
      color: '#EF4444',
      title: 'STAY UPDATED',
      desc: 'Get notified about credential\nissues and verifications.',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] p-6">
      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div 
          className="w-32 h-32 pixel-corners flex items-center justify-center mb-8"
          style={{ backgroundColor: currentSlide.color }}
        >
          <Icon className="w-16 h-16 text-white" strokeWidth={3} />
        </div>

        <h2 
          className="pixel-text text-lg mb-4 whitespace-pre-line"
          style={{ color: currentSlide.color }}
        >
          {currentSlide.title}
        </h2>
        
        <p className="pixel-text text-[10px] text-[#888] leading-relaxed whitespace-pre-line max-w-[280px]">
          {currentSlide.desc}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 ${
              index === step ? 'bg-[#4F46E5]' : 'bg-[#2a2a2a]'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <PixelButton variant="primary" fullWidth onClick={handleNext}>
          {step < slides.length - 1 ? 'NEXT' : 'GET STARTED'}
        </PixelButton>
        
        {step < slides.length - 1 && (
          <button 
            onClick={onComplete}
            className="w-full pixel-text text-xs text-[#888] hover:text-[#06B6D4]"
          >
            SKIP
          </button>
        )}
      </div>
    </div>
  );
}
