import { PixelCard } from '../ui/PixelCard';
import { StatusPill } from '../ui/StatusPill';
import { FileText, Shield, XCircle, Clock, ExternalLink } from 'lucide-react';

export function ActivityScreen() {
  const activities = [
    {
      id: 1,
      type: 'issuance' as const,
      title: 'Credential Issued',
      description: 'Aadhaar KYC credential issued by UIDAI',
      timestamp: '2 hours ago',
      status: 'confirmed' as const,
      vcId: 'vc_001',
      txHash: '0xabc123...def456',
    },
    {
      id: 2,
      type: 'verification' as const,
      title: 'Verification Request',
      description: 'Bank of India verified your KYC',
      timestamp: '5 hours ago',
      status: 'confirmed' as const,
      vcId: 'vc_001',
    },
    {
      id: 3,
      type: 'verification' as const,
      title: 'Verification Request',
      description: 'Hotel verified Work Pass',
      timestamp: '1 day ago',
      status: 'confirmed' as const,
      vcId: 'vc_003',
    },
    {
      id: 4,
      type: 'revocation' as const,
      title: 'Credential Revoked',
      description: 'Old KYC revoked by issuer',
      timestamp: '3 days ago',
      status: 'confirmed' as const,
      vcId: 'vc_000',
      txHash: '0xdef456...ghi789',
    },
    {
      id: 5,
      type: 'transaction' as const,
      title: 'Transaction Pending',
      description: 'Waiting for block confirmation',
      timestamp: '5 days ago',
      status: 'pending' as const,
      txHash: '0xghi789...jkl012',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issuance':
        return <FileText className="w-5 h-5 text-[#10B981]" strokeWidth={3} />;
      case 'verification':
        return <Shield className="w-5 h-5 text-[#06B6D4]" strokeWidth={3} />;
      case 'revocation':
        return <XCircle className="w-5 h-5 text-[#EF4444]" strokeWidth={3} />;
      case 'transaction':
        return <Clock className="w-5 h-5 text-[#888]" strokeWidth={3} />;
      default:
        return <FileText className="w-5 h-5 text-[#888]" strokeWidth={3} />;
    }
  };

  return (
    <div className="p-4 space-y-4 bg-[#0f0f0f]">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-white">12</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">TOTAL</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-[#10B981]">11</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">CONFIRMED</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-[#EF4444]">1</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">PENDING</div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-2">
        <div className="pixel-text text-xs text-[#888]">RECENT ACTIVITY</div>
        
        {activities.map((activity) => (
          <PixelCard key={activity.id}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="pixel-text text-xs text-white">{activity.title}</div>
                    <StatusPill 
                      status={activity.status === 'confirmed' ? 'success' : 'pending'} 
                      label={activity.status.toUpperCase()}
                    />
                  </div>
                  <div className="pixel-text text-[10px] text-[#888] mb-2">
                    {activity.description}
                  </div>
                  <div className="pixel-text text-[8px] text-[#555]">
                    {activity.timestamp}
                  </div>
                </div>
              </div>

              {/* Details */}
              {activity.vcId && (
                <div className="pt-2 border-t-2 border-[#1a1a1a]">
                  <div className="flex items-center justify-between">
                    <span className="pixel-text text-[8px] text-[#888]">VC ID</span>
                    <span className="pixel-text text-[8px] text-[#4F46E5]">{activity.vcId}</span>
                  </div>
                </div>
              )}

              {activity.txHash && (
                <button className="w-full flex items-center justify-between p-2 bg-[#1a1a1a] border-2 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
                  <span className="pixel-text text-[8px] text-[#888]">{activity.txHash}</span>
                  <ExternalLink className="w-3 h-3 text-[#888]" />
                </button>
              )}
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  );
}
