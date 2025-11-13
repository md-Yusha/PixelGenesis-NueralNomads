import { StatusPill } from './StatusPill';
import { Award } from 'lucide-react';

interface WebCredentialCardProps {
  credential: {
    vcId: string;
    title: string;
    issuer: string;
    issuerDID: string;
    status: 'active' | 'revoked' | 'expiring';
    issuedDate: string;
    expiryDate?: string;
    claims: Record<string, any>;
    color: string;
  };
  onClick?: () => void;
}

export function WebCredentialCard({ credential, onClick }: WebCredentialCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors text-left"
    >
      <div className="p-4">
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-16 h-16 pixel-corners flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: credential.color }}
          >
            <Award className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="pixel-text text-sm text-white truncate">{credential.title}</div>
              <StatusPill status={credential.status} label={credential.status.toUpperCase()} />
            </div>
            <div className="pixel-text text-xs text-[#888] mb-1">{credential.issuer}</div>
            <div className="pixel-text text-xs text-[#555]">
              Issued: {credential.issuedDate}
            </div>
          </div>
        </div>

        {/* Quick Claims Preview */}
        <div className="pt-3 border-t-2 border-[#1a1a1a] space-y-2">
          {Object.entries(credential.claims).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="pixel-text text-[10px] text-[#888]">{key}</span>
              <span className="pixel-text text-[10px] text-white truncate ml-2 max-w-[150px]">{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}
