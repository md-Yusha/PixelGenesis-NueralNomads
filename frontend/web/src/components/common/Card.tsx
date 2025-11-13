import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', footer }) => {
  return (
    <div
      className={`bg-[#0f0f0f] border-4 border-[#2a2a2a] pixel-corners shadow-[0_0_0_1px_rgba(15,15,15,0.6)] ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b-4 border-[#1a1a1a] bg-[#0a0a0a] pixel-corners">
          <h3 className="pixel-text text-sm text-white">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4 text-[#f9fafb]">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t-4 border-[#1a1a1a] bg-[#0a0a0a] pixel-corners text-[#f9fafb]">
          {footer}
        </div>
      )}
    </div>
  );
};

