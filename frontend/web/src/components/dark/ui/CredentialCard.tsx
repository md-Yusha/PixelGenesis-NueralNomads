import { useState } from 'react';
import { StatusPill } from './StatusPill';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';

interface CredentialCardProps {
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

export function CredentialCard({ credential, onClick }: CredentialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
      {/* Compact View */}
      <button
        onClick={() => onClick?.()}
        className="w-full p-4"
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 pixel-corners flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: credential.color }}
          >
            <Award className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="pixel-text text-xs text-white">{credential.title}</div>
              <StatusPill status={credential.status} label={credential.status.toUpperCase()} />
            </div>
            <div className="pixel-text text-[10px] text-[#888] mb-1">{credential.issuer}</div>
            <div className="pixel-text text-[8px] text-[#555]">
              Issued: {credential.issuedDate}
            </div>
          </div>
        </div>
      </button>

      {/* Expandable Details */}
      <div className="border-t-4 border-[#2a2a2a]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-colors"
        >
          <span className="pixel-text text-[8px] text-[#888]">
            {isExpanded ? 'HIDE DETAILS' : 'SHOW DETAILS'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#888]" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 pt-0 space-y-2">
            <div className="pixel-text text-[10px] text-[#888] mb-2">CLAIMS</div>
            {Object.entries(credential.claims).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a]">
                <span className="pixel-text text-[8px] text-[#888]">{key}</span>
                <span className="pixel-text text-[8px] text-white">{value}</span>
              </div>
            ))}
            
            <div className="pt-2">
              <div className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a]">
                <span className="pixel-text text-[8px] text-[#888]">VC ID</span>
                <span className="pixel-text text-[8px] text-[#4F46E5]">{credential.vcId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a]">
                <span className="pixel-text text-[8px] text-[#888]">Issuer DID</span>
                <span className="pixel-text text-[8px] text-[#06B6D4] truncate max-w-[200px]">
                  {credential.issuerDID}
                </span>
              </div>
              {credential.expiryDate && (
                <div className="flex items-center justify-between py-2 border-t-2 border-[#1a1a1a]">
                  <span className="pixel-text text-[8px] text-[#888]">Expires</span>
                  <span className="pixel-text text-[8px] text-white">{credential.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
