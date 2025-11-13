import React from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center pixel-text uppercase tracking-tight border-4 border-[#2a2a2a] pixel-corners transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/60 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5';

  type VariantType = 'primary' | 'secondary' | 'danger' | 'outline';
  type SizeType = 'sm' | 'md' | 'lg';

  const variantStyles: Record<VariantType, string> = {
    primary:
      'bg-[#4F46E5] text-white hover:border-[#4F46E5] hover:bg-[#4338CA] focus-visible:border-[#4F46E5]',
    secondary:
      'bg-[#1a1a1a] text-white hover:border-[#06B6D4] focus-visible:border-[#06B6D4]',
    danger:
      'bg-[#EF4444] text-white hover:border-[#EF4444] hover:bg-[#DC2626] focus-visible:border-[#EF4444]',
    outline:
      'bg-transparent text-[#06B6D4] hover:bg-[#1a1a1a] hover:border-[#06B6D4] focus-visible:border-[#06B6D4]',
  };

  const sizeStyles: Record<SizeType, string> = {
    sm: 'px-3 py-2 text-[10px]',
    md: 'px-4 py-3 text-xs',
    lg: 'px-6 py-4 text-sm',
  };

  const variantKey: VariantType = (variant ?? 'primary') as VariantType;
  const sizeKey: SizeType = (size ?? 'md') as SizeType;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variantKey]} ${sizeStyles[sizeKey]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

