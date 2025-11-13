import { ReactNode } from 'react';

interface PixelButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  onClick?: () => void;
}

export function PixelButton({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  onClick 
}: PixelButtonProps) {
  const variantStyles = {
    primary: 'bg-[#4F46E5] border-[#4F46E5] text-white hover:bg-[#4338CA]',
    secondary: 'bg-[#06B6D4] border-[#06B6D4] text-white hover:bg-[#0891B2]',
    danger: 'bg-[#EF4444] border-[#EF4444] text-white hover:bg-[#DC2626]',
  };

  return (
    <button
      onClick={onClick}
      className={`
        pixel-text px-6 py-3 border-4 pixel-corners 
        transition-all active:translate-y-1
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}
