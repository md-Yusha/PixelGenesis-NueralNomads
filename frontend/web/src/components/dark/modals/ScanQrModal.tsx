import { X, Camera } from 'lucide-react';

interface ScanQrModalProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export function ScanQrModal({ onClose, onScan }: ScanQrModalProps) {
  // Mock scan after 2 seconds
  const handleMockScan = () => {
    setTimeout(() => {
      onScan('{"vcId": "vc_001", "claims": {...}}');
    }, 2000);
  };

  return (
    <div className="absolute inset-0 z-50">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="pixel-text text-sm text-white">SCAN QR CODE</div>
          <button 
            onClick={onClose}
            className="p-2 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5]"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[280px] aspect-square">
            {/* Scanner Frame */}
            <div className="absolute inset-0 border-4 border-[#4F46E5]">
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-[#4F46E5]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-[#4F46E5]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-[#4F46E5]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-[#4F46E5]"></div>
              
              {/* Scanning Line Animation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-[#4F46E5] animate-scan"></div>
            </div>

            {/* Camera Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-16 h-16 text-[#4F46E5]/30" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 text-center space-y-3">
          <div className="pixel-text text-xs text-white">
            Position QR code within frame
          </div>
          <div className="pixel-text text-[10px] text-[#888]">
            Scanning will happen automatically
          </div>
          
          {/* Mock Scan Button (for demo) */}
          <button
            onClick={handleMockScan}
            className="mt-4 px-4 py-2 bg-[#4F46E5] border-4 border-[#4F46E5] pixel-corners hover:bg-[#4338CA]"
          >
            <span className="pixel-text text-xs text-white">SIMULATE SCAN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
