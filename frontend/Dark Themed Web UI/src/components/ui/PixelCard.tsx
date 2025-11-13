import { ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
}

export function PixelCard({ children, className = '' }: PixelCardProps) {
  return (
    <div className={`bg-[#0f0f0f] border-4 border-[#2a2a2a] p-4 pixel-corners ${className}`}>
      {children}
    </div>
  );
}
