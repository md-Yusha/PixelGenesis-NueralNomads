import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block pixel-text text-[10px] text-[#888] mb-2 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 bg-[#1a1a1a] text-white border-4 pixel-corners
          focus-visible:outline-none focus-visible:border-[#4F46E5]
          placeholder:text-[#555]
          disabled:bg-[#111] disabled:text-[#555] disabled:cursor-not-allowed
          ${error ? 'border-[#EF4444]' : 'border-[#2a2a2a]'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-2 pixel-text text-[9px] text-[#EF4444] uppercase">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 pixel-text text-[9px] text-[#888] uppercase">{helperText}</p>
      )}
    </div>
  );
};

