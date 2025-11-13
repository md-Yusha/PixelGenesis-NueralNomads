import { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { FormField } from '../ui/FormField';
import { X, Search, FileText, Plus, Trash2 } from 'lucide-react';

interface IssueCredentialModalProps {
  onClose: () => void;
  onIssue: (data: any) => void;
}

export function IssueCredentialModal({ onClose, onIssue }: IssueCredentialModalProps) {
  const [step, setStep] = useState(1);
  const [holderDID, setHolderDID] = useState('');
  const [credentialType, setCredentialType] = useState('');
  const [claims, setClaims] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' },
  ]);

  const credentialTypes = [
    { id: 'kyc', label: 'KYC Credential', schema: 'kyc-v1' },
    { id: 'education', label: 'Education Certificate', schema: 'edu-v1' },
    { id: 'employment', label: 'Employment Pass', schema: 'emp-v1' },
  ];

  const addClaim = () => {
    setClaims([...claims, { key: '', value: '' }]);
  };

  const removeClaim = (index: number) => {
    setClaims(claims.filter((_, i) => i !== index));
  };

  const updateClaim = (index: number, field: 'key' | 'value', value: string) => {
    const newClaims = [...claims];
    newClaims[index][field] = value;
    setClaims(newClaims);
  };

  const handleIssue = () => {
    const data = {
      holderDID,
      credentialType,
      claims: Object.fromEntries(claims.map(c => [c.key, c.value])),
    };
    onIssue(data);
  };

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
        <div className="p-4 border-b-4 border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="pixel-text text-sm text-white mb-1">ISSUE CREDENTIAL</div>
            <div className="pixel-text text-[10px] text-[#888]">Step {step} of 4</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] pixel-corners">
            <X className="w-5 h-5 text-[#888]" />
          </button>
        </div>

        {/* Stepper */}
        <div className="p-4 border-b-4 border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 pixel-corners flex items-center justify-center border-4 ${
                    step >= s
                      ? 'bg-[#4F46E5] border-[#4F46E5]'
                      : 'bg-[#1a1a1a] border-[#2a2a2a]'
                  }`}
                >
                  <span className={`pixel-text text-xs ${step >= s ? 'text-white' : 'text-[#888]'}`}>
                    {s}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`w-8 h-1 ${step > s ? 'bg-[#4F46E5]' : 'bg-[#2a2a2a]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Step 1: Choose Holder */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="pixel-text text-xs text-[#888]">SELECT HOLDER</div>
              <FormField
                label="Holder DID"
                value={holderDID}
                onChange={setHolderDID}
                placeholder="did:pixel:0x..."
                icon={<Search className="w-4 h-4" />}
              />
              <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3">
                <div className="pixel-text text-[8px] text-[#888] mb-2">RECENT HOLDERS</div>
                {['did:pixel:0x123...abc', 'did:pixel:0x456...def'].map((did, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHolderDID(did)}
                    className="w-full text-left p-2 hover:bg-[#1a1a1a] pixel-corners mb-1"
                  >
                    <span className="pixel-text text-[10px] text-white">{did}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Type */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="pixel-text text-xs text-[#888]">CREDENTIAL TYPE & SCHEMA</div>
              {credentialTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCredentialType(type.id)}
                  className={`w-full p-4 border-4 pixel-corners transition-all ${
                    credentialType === type.id
                      ? 'bg-[#1a1a1a] border-[#4F46E5]'
                      : 'bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText 
                      className={`w-5 h-5 ${
                        credentialType === type.id ? 'text-[#4F46E5]' : 'text-[#888]'
                      }`}
                      strokeWidth={3}
                    />
                    <div className="flex-1 text-left">
                      <div className="pixel-text text-xs text-white">{type.label}</div>
                      <div className="pixel-text text-[8px] text-[#888] mt-1">Schema: {type.schema}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Add Claims */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="pixel-text text-xs text-[#888]">ADD CLAIMS</div>
                <button
                  onClick={addClaim}
                  className="p-2 bg-[#4F46E5] border-2 border-[#4F46E5] pixel-corners hover:bg-[#4338CA]"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {claims.map((claim, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="pixel-text text-[10px] text-[#888]">Claim {idx + 1}</span>
                    {claims.length > 1 && (
                      <button
                        onClick={() => removeClaim(idx)}
                        className="p-1 hover:bg-[#1a1a1a] pixel-corners"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </button>
                    )}
                  </div>
                  <FormField
                    label="Key"
                    value={claim.key}
                    onChange={(v) => updateClaim(idx, 'key', v)}
                    placeholder="e.g., name, aadhaar"
                  />
                  <FormField
                    label="Value"
                    value={claim.value}
                    onChange={(v) => updateClaim(idx, 'value', v)}
                    placeholder="e.g., John Doe"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Preview & Sign */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="pixel-text text-xs text-[#888]">PREVIEW & SIGN</div>
              
              <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3 space-y-2">
                <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                  <span className="pixel-text text-[10px] text-[#888]">Holder</span>
                  <span className="pixel-text text-[8px] text-white truncate max-w-[200px]">{holderDID}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                  <span className="pixel-text text-[10px] text-[#888]">Type</span>
                  <span className="pixel-text text-[10px] text-white">{credentialType}</span>
                </div>
                <div className="py-2">
                  <div className="pixel-text text-[10px] text-[#888] mb-2">Claims</div>
                  {claims.map((claim, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                      <span className="pixel-text text-[8px] text-[#888]">{claim.key}</span>
                      <span className="pixel-text text-[8px] text-white">{claim.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners p-3">
                <div className="flex items-center justify-between">
                  <span className="pixel-text text-[10px] text-[#888]">Estimated Gas</span>
                  <span className="pixel-text text-[10px] text-[#10B981]">0.0023 ETH</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-2 pt-4">
            {step > 1 && (
              <PixelButton variant="secondary" fullWidth onClick={() => setStep(step - 1)}>
                BACK
              </PixelButton>
            )}
            {step < 4 ? (
              <PixelButton 
                variant="primary" 
                fullWidth 
                onClick={() => setStep(step + 1)}
              >
                NEXT
              </PixelButton>
            ) : (
              <PixelButton 
                variant="primary" 
                fullWidth 
                onClick={handleIssue}
              >
                SIGN & ISSUE
              </PixelButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
