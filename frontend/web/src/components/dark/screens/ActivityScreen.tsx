import { PixelCard } from '../ui/PixelCard';
import { StatusPill } from '../ui/StatusPill';
import { FileText, Shield, XCircle, Clock, ExternalLink, Filter, Download } from 'lucide-react';

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
      description: 'Bank of India verified your KYC credential',
      timestamp: '5 hours ago',
      status: 'confirmed' as const,
      vcId: 'vc_001',
    },
    {
      id: 3,
      type: 'verification' as const,
      title: 'Verification Request',
      description: 'Hotel verified Work Pass credential',
      timestamp: '1 day ago',
      status: 'confirmed' as const,
      vcId: 'vc_003',
    },
    {
      id: 4,
      type: 'revocation' as const,
      title: 'Credential Revoked',
      description: 'Old KYC credential revoked by issuer',
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
    {
      id: 6,
      type: 'issuance' as const,
      title: 'Credential Issued',
      description: 'College ID issued by MIT',
      timestamp: '1 week ago',
      status: 'confirmed' as const,
      vcId: 'vc_002',
      txHash: '0xjkl012...mno345',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issuance':
        return <FileText className="w-6 h-6 text-[#10B981]" strokeWidth={3} />;
      case 'verification':
        return <Shield className="w-6 h-6 text-[#06B6D4]" strokeWidth={3} />;
      case 'revocation':
        return <XCircle className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />;
      case 'transaction':
        return <Clock className="w-6 h-6 text-[#888]" strokeWidth={3} />;
      default:
        return <FileText className="w-6 h-6 text-[#888]" strokeWidth={3} />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="pixel-text text-lg text-white mb-2">ACTIVITY FEED</h1>
          <p className="pixel-text text-xs text-[#888]">Track all credential operations</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5]">
            <Filter className="w-5 h-5 text-[#888]" />
          </button>
          <button className="p-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5]">
            <Download className="w-5 h-5 text-[#888]" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-white mb-1">24</div>
          <div className="pixel-text text-xs text-[#888]">TOTAL EVENTS</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#10B981] mb-1">22</div>
          <div className="pixel-text text-xs text-[#888]">CONFIRMED</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#EF4444] mb-1">2</div>
          <div className="pixel-text text-xs text-[#888]">PENDING</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#06B6D4] mb-1">12</div>
          <div className="pixel-text text-xs text-[#888]">THIS WEEK</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <PixelCard key={activity.id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="pixel-text text-sm text-white mb-1">{activity.title}</div>
                    <div className="pixel-text text-xs text-[#888] mb-2">
                      {activity.description}
                    </div>
                    <div className="pixel-text text-xs text-[#555]">
                      {activity.timestamp}
                    </div>
                  </div>
                  <StatusPill 
                    status={activity.status === 'confirmed' ? 'success' : 'pending'} 
                    label={activity.status.toUpperCase()}
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t-2 border-[#1a1a1a]">
                  {activity.vcId && (
                    <div className="flex items-center justify-between">
                      <span className="pixel-text text-xs text-[#888]">VC ID</span>
                      <span className="pixel-text text-xs text-[#4F46E5]">{activity.vcId}</span>
                    </div>
                  )}

                  {activity.txHash && (
                    <button className="flex items-center justify-between p-2 bg-[#1a1a1a] border-2 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
                      <span className="pixel-text text-xs text-[#888] truncate">{activity.txHash}</span>
                      <ExternalLink className="w-3 h-3 text-[#888] flex-shrink-0 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </PixelCard>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <button className="px-6 py-3 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] transition-colors">
          <span className="pixel-text text-xs text-white">LOAD MORE</span>
        </button>
      </div>
    </div>
  );
}
