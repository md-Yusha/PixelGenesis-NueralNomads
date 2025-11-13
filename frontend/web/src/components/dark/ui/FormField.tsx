import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  helper?: string;
}

export function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  icon,
  error,
  helper
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="pixel-text text-[10px] text-[#888]">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners px-3 py-2 pixel-text text-xs text-white placeholder:text-[#555] focus:border-[#4F46E5] outline-none transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#EF4444]' : ''}`}
        />
      </div>
      {error && (
        <div className="pixel-text text-[8px] text-[#EF4444]">{error}</div>
      )}
      {helper && !error && (
        <div className="pixel-text text-[8px] text-[#888]">{helper}</div>
      )}
    </div>
  );
}
