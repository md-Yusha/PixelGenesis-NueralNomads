interface StatusPillProps {
  status: 'success' | 'pending' | 'error' | 'warning' | 'active' | 'revoked' | 'expiring';
  label: string;
}

export function StatusPill({ status, label }: StatusPillProps) {
  const colorMap = {
    success: { bg: '#10B981', text: 'black' },
    pending: { bg: '#888', text: 'white' },
    error: { bg: '#EF4444', text: 'white' },
    warning: { bg: '#EF4444', text: 'white' },
    active: { bg: '#10B981', text: 'black' },
    revoked: { bg: '#EF4444', text: 'white' },
    expiring: { bg: '#EF4444', text: 'white' },
  };

  const colors = colorMap[status];

  return (
    <div 
      className="px-2 py-1 pixel-corners flex-shrink-0"
      style={{ backgroundColor: colors.bg }}
    >
      <span 
        className="pixel-text text-[8px]"
        style={{ color: colors.text }}
      >
        {label}
      </span>
    </div>
  );
}
