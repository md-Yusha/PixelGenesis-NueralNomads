import { useState } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { StatusPill } from '../ui/StatusPill';
import { ScanQrModal } from '../modals/ScanQrModal';
import { Camera, FileText, Shield, CheckCircle2, XCircle, ExternalLink, Upload } from 'lucide-react';

export function ScanVerifyScreen() {
  const [inputMode, setInputMode] = useState<'paste' | 'scan' | 'upload'>('paste');
  const [vcInput, setVcInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleVerify = () => {
    // Mock verification
    setVerificationResult({
      isValid: true,
      vcId: 'vc_001',
      issuer: 'UIDAI',
      holder: 'did:pixel:0x742d...f0bEb',
      issuedDate: '2025-01-15',
      onChainStatus: 'confirmed',
      blockNumber: 12345678,
      txHash: '0xabc123...def456',
      reasons: [
        'Signature verified ✓',
        'Not revoked ✓',
        'Within validity period ✓',
        'On-chain record found ✓',
      ],
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="pixel-text text-lg text-white mb-2">SCAN & VERIFY</h1>
        <p className="pixel-text text-xs text-[#888]">Verify the authenticity of credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setInputMode('paste')}
              className={`p-6 border-4 pixel-corners transition-all ${
                inputMode === 'paste'
                  ? 'bg-[#1a1a1a] border-[#4F46E5]'
                  : 'bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <FileText 
                className={`w-8 h-8 mx-auto mb-3 ${
                  inputMode === 'paste' ? 'text-[#4F46E5]' : 'text-[#888]'
                }`}
                strokeWidth={3}
              />
              <div className={`pixel-text text-xs ${
                inputMode === 'paste' ? 'text-white' : 'text-[#888]'
              }`}>
                PASTE JSON
              </div>
            </button>

            <button
              onClick={() => {
                setInputMode('scan');
                setIsScanning(true);
              }}
              className={`p-6 border-4 pixel-corners transition-all ${
                inputMode === 'scan'
                  ? 'bg-[#1a1a1a] border-[#06B6D4]'
                  : 'bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <Camera 
                className={`w-8 h-8 mx-auto mb-3 ${
                  inputMode === 'scan' ? 'text-[#06B6D4]' : 'text-[#888]'
                }`}
                strokeWidth={3}
              />
              <div className={`pixel-text text-xs ${
                inputMode === 'scan' ? 'text-white' : 'text-[#888]'
              }`}>
                SCAN QR
              </div>
            </button>

            <button
              onClick={() => setInputMode('upload')}
              className={`p-6 border-4 pixel-corners transition-all ${
                inputMode === 'upload'
                  ? 'bg-[#1a1a1a] border-[#10B981]'
                  : 'bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <Upload 
                className={`w-8 h-8 mx-auto mb-3 ${
                  inputMode === 'upload' ? 'text-[#10B981]' : 'text-[#888]'
                }`}
                strokeWidth={3}
              />
              <div className={`pixel-text text-xs ${
                inputMode === 'upload' ? 'text-white' : 'text-[#888]'
              }`}>
                UPLOAD FILE
              </div>
            </button>
          </div>

          {/* Input Area */}
          {inputMode === 'paste' && (
            <PixelCard>
              <div className="space-y-4">
                <div className="pixel-text text-xs text-[#888]">PASTE VC JSON OR HASH</div>
                <textarea
                  value={vcInput}
                  onChange={(e) => setVcInput(e.target.value)}
                  placeholder='{"vcId": "vc_001", "claims": {...}}'
                  className="w-full h-48 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners p-4 pixel-text text-xs text-white placeholder:text-[#555] focus:border-[#4F46E5] outline-none resize-none"
                />
                <PixelButton variant="primary" fullWidth onClick={handleVerify}>
                  <Shield className="w-4 h-4 inline mr-2" />
                  VERIFY CREDENTIAL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Info Card */}
          {!verificationResult && (
            <PixelCard>
              <div className="text-center py-8">
                <Shield className="w-16 h-16 mx-auto mb-4 text-[#4F46E5]" strokeWidth={3} />
                <div className="pixel-text text-sm text-white mb-3">HOW TO VERIFY</div>
                <div className="pixel-text text-xs text-[#888] leading-relaxed">
                  Paste the VC JSON or hash,<br/>
                  scan a QR code, or upload a file<br/>
                  to verify credential authenticity.
                </div>
              </div>
            </PixelCard>
          )}
        </div>

        {/* Right: Results */}
        <div>
          {verificationResult ? (
            <div className="space-y-4">
              <PixelCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="pixel-text text-sm text-white">VERIFICATION RESULT</div>
                    {verificationResult.isValid ? (
                      <CheckCircle2 className="w-8 h-8 text-[#10B981]" strokeWidth={3} />
                    ) : (
                      <XCircle className="w-8 h-8 text-[#EF4444]" strokeWidth={3} />
                    )}
                  </div>

                  <div className={`p-6 border-4 pixel-corners text-center ${
                    verificationResult.isValid 
                      ? 'bg-[#10B981]/10 border-[#10B981]' 
                      : 'bg-[#EF4444]/10 border-[#EF4444]'
                  }`}>
                    <div className={`pixel-text text-lg ${
                      verificationResult.isValid ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}>
                      {verificationResult.isValid ? 'VALID CREDENTIAL' : 'INVALID CREDENTIAL'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="pixel-text text-xs text-[#888] mb-2">CREDENTIAL DETAILS</div>
                    <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                      <span className="pixel-text text-xs text-[#888]">VC ID</span>
                      <span className="pixel-text text-xs text-white">{verificationResult.vcId}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                      <span className="pixel-text text-xs text-[#888]">Issuer</span>
                      <span className="pixel-text text-xs text-white">{verificationResult.issuer}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                      <span className="pixel-text text-xs text-[#888]">Holder</span>
                      <span className="pixel-text text-xs text-white">{verificationResult.holder}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b-2 border-[#1a1a1a]">
                      <span className="pixel-text text-xs text-[#888]">Issued</span>
                      <span className="pixel-text text-xs text-white">{verificationResult.issuedDate}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="pixel-text text-xs text-[#888]">On-chain</span>
                      <StatusPill status="success" label="CONFIRMED" />
                    </div>
                  </div>
                </div>
              </PixelCard>

              {/* Verification Checks */}
              <PixelCard>
                <div className="space-y-3">
                  <div className="pixel-text text-xs text-[#888]">VERIFICATION CHECKS</div>
                  {verificationResult.reasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 py-2 border-t-2 border-[#1a1a1a] first:border-t-0">
                      <div className="w-3 h-3 bg-[#10B981]"></div>
                      <span className="pixel-text text-xs text-white">{reason}</span>
                    </div>
                  ))}
                </div>
              </PixelCard>

              {/* Blockchain Info */}
              <PixelCard>
                <div className="space-y-3">
                  <div className="pixel-text text-xs text-[#888]">BLOCKCHAIN INFO</div>
                  <div className="flex items-center justify-between py-2">
                    <span className="pixel-text text-xs text-[#888]">Block Number</span>
                    <span className="pixel-text text-xs text-white">{verificationResult.blockNumber.toLocaleString()}</span>
                  </div>
                  <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
                    <span className="pixel-text text-xs text-white truncate">{verificationResult.txHash}</span>
                    <ExternalLink className="w-4 h-4 text-[#888] flex-shrink-0 ml-2" />
                  </button>
                </div>
              </PixelCard>
            </div>
          ) : (
            <PixelCard>
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners flex items-center justify-center">
                  <Shield className="w-12 h-12 text-[#888]" strokeWidth={3} />
                </div>
                <div className="pixel-text text-sm text-white mb-2">AWAITING INPUT</div>
                <div className="pixel-text text-xs text-[#888]">
                  Select an input method and provide<br/>
                  the credential data to verify
                </div>
              </div>
            </PixelCard>
          )}
        </div>
      </div>

      {/* Scan Modal */}
      {isScanning && (
        <ScanQrModal
          onClose={() => setIsScanning(false)}
          onScan={(data) => {
            setVcInput(data);
            setIsScanning(false);
            handleVerify();
          }}
        />
      )}
    </div>
  );
}
