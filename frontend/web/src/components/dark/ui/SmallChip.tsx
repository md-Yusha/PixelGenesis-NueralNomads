import { ReactNode } from 'react';
import { Copy } from 'lucide-react';

interface SmallChipProps {
  label: string;
  icon?: ReactNode;
  color?: string;
  onCopy?: () => void;
}

export function SmallChip({ label, icon, color = '#4F46E5', onCopy }: SmallChipProps) {
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 border-2 pixel-corners max-w-full"
      style={{ 
        backgroundColor: '#0a0a0a',
        borderColor: color
      }}
    >
      {icon && <div style={{ color }}>{icon}</div>}
      <span 
        className="pixel-text text-[8px] truncate"
        style={{ color }}
      >
        {label}
      </span>
      {onCopy && (
        <button 
          onClick={onCopy}
          className="hover:scale-110 transition-transform"
        >
          <Copy className="w-3 h-3" style={{ color }} />
        </button>
      )}
    </div>
  );
}
