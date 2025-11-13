import { PixelButton } from '../ui/PixelButton';
import { StatusPill } from '../ui/StatusPill';
import { JsonViewer } from '../ui/JsonViewer';
import { X, QrCode, Download, XCircle, ExternalLink, Shield } from 'lucide-react';

interface CredentialDetailModalProps {
  credential: any;
  onClose: () => void;
  userRole: 'holder' | 'issuer' | 'verifier';
}

export function CredentialDetailModal({ credential, onClose, userRole }: CredentialDetailModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full max-h-[90%] bg-[#0f0f0f] border-t-4 border-[#2a2a2a] pixel-corners overflow-y-auto">
        {/* Drag Handle */}
        <div className="flex justify-center py-3 border-b-4 border-[#2a2a2a]">
          <div className="w-12 h-1 bg-[#888]"></div>
        </div>

        {/* Header */}
        <div className="p-4 border-b-4 border-[#2a2a2a]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="pixel-text text-sm text-white mb-1">{credential.title}</div>
              <div className="pixel-text text-[10px] text-[#888]">{credential.issuer}</div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] pixel-corners">
              <X className="w-5 h-5 text-[#888]" />
            </button>
          </div>
          <StatusPill status={credential.status} label={credential.status.toUpperCase()} />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Claims */}
          <div>
            <div className="pixel-text text-xs text-[#888] mb-3">CLAIMS</div>
            <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3 space-y-2">
              {Object.entries(credential.claims).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a] last:border-b-0">
                  <span className="pixel-text text-[10px] text-[#888]">{key}</span>
                  <span className="pixel-text text-[10px] text-white">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <div className="pixel-text text-xs text-[#888] mb-3">METADATA</div>
            <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3 space-y-2">
              <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                <span className="pixel-text text-[10px] text-[#888]">VC ID</span>
                <span className="pixel-text text-[10px] text-[#4F46E5]">{credential.vcId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                <span className="pixel-text text-[10px] text-[#888]">Issuer DID</span>
                <span className="pixel-text text-[8px] text-[#06B6D4] truncate max-w-[200px]">
                  {credential.issuerDID}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                <span className="pixel-text text-[10px] text-[#888]">Issued</span>
                <span className="pixel-text text-[10px] text-white">{credential.issuedDate}</span>
              </div>
              {credential.expiryDate && (
                <div className="flex items-center justify-between py-2">
                  <span className="pixel-text text-[10px] text-[#888]">Expires</span>
                  <span className="pixel-text text-[10px] text-white">{credential.expiryDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Proof Block */}
          <div>
            <div className="pixel-text text-xs text-[#888] mb-3">PROOF</div>
            <JsonViewer 
              data={{
                type: 'EcdsaSecp256k1Signature2019',
                created: credential.issuedDate,
                verificationMethod: credential.issuerDID,
                proofValue: 'z3FXQi...7Qed (truncated)',
              }}
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <PixelButton variant="secondary" fullWidth>
              <QrCode className="w-4 h-4 inline mr-1" />
              SHARE
            </PixelButton>
            <PixelButton variant="secondary" fullWidth>
              <Download className="w-4 h-4 inline mr-1" />
              EXPORT
            </PixelButton>
          </div>

          <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
            <span className="pixel-text text-[10px] text-white">View on IPFS</span>
            <ExternalLink className="w-4 h-4 text-[#888]" />
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
            <span className="pixel-text text-[10px] text-white">View on Explorer</span>
            <ExternalLink className="w-4 h-4 text-[#888]" />
          </button>

          {/* Revoke (Issuer only) */}
          {userRole === 'issuer' && credential.status === 'active' && (
            <PixelButton variant="danger" fullWidth>
              <XCircle className="w-4 h-4 inline mr-2" />
              REVOKE CREDENTIAL
            </PixelButton>
          )}

          {/* Verify */}
          <PixelButton variant="primary" fullWidth>
            <Shield className="w-4 h-4 inline mr-2" />
            VERIFY NOW
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
