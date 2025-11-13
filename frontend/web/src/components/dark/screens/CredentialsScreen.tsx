import { useState } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { CredentialCard } from '../ui/CredentialCard';
import { PixelButton } from '../ui/PixelButton';
import { CredentialDetailModal } from '../modals/CredentialDetailModal';
import { IssueCredentialModal } from '../modals/IssueCredentialModal';
import { Search, Filter, Plus, Download } from 'lucide-react';

interface CredentialsScreenProps {
  userRole: 'holder' | 'issuer' | 'verifier';
}

type FilterType = 'all' | 'active' | 'revoked' | 'expiring';

export function CredentialsScreen({ userRole }: CredentialsScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredential, setSelectedCredential] = useState<any>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const mockCredentials = [
    {
      vcId: 'vc_001',
      title: 'Aadhaar KYC',
      issuer: 'UIDAI',
      issuerDID: 'did:pixel:0x123...abc',
      status: 'active' as const,
      issuedDate: '2025-01-15',
      expiryDate: '2026-01-15',
      claims: { name: 'John Doe', aadhaar: '****-6789' },
      color: '#10B981',
    },
    {
      vcId: 'vc_002',
      title: 'College ID',
      issuer: 'MIT',
      issuerDID: 'did:pixel:0x456...def',
      status: 'active' as const,
      issuedDate: '2024-09-01',
      expiryDate: '2025-06-30',
      claims: { name: 'John Doe', studentId: 'MIT-2021-042' },
      color: '#4F46E5',
    },
    {
      vcId: 'vc_003',
      title: 'Work Pass',
      issuer: 'TechCorp',
      issuerDID: 'did:pixel:0x789...ghi',
      status: 'expiring' as const,
      issuedDate: '2024-01-01',
      expiryDate: '2025-12-31',
      claims: { name: 'John Doe', employeeId: 'EMP-5678' },
      color: '#06B6D4',
    },
    {
      vcId: 'vc_004',
      title: 'Driver License',
      issuer: 'DMV',
      issuerDID: 'did:pixel:0xabc...123',
      status: 'active' as const,
      issuedDate: '2023-05-20',
      expiryDate: '2028-05-20',
      claims: { name: 'John Doe', licenseNo: 'DL-9876543' },
      color: '#EF4444',
    },
  ];

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: 4 },
    { id: 'active', label: 'Active', count: 3 },
    { id: 'revoked', label: 'Revoked', count: 0 },
    { id: 'expiring', label: 'Expiring', count: 1 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="pixel-text text-lg text-white mb-2">CREDENTIALS</h1>
          <p className="pixel-text text-xs text-[#888]">Manage your verifiable credentials</p>
        </div>
        {userRole === 'issuer' && (
          <PixelButton variant="primary" onClick={() => setIsIssueModalOpen(true)}>
            <Plus className="w-4 h-4 inline mr-2" />
            ISSUE CREDENTIAL
          </PixelButton>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-white mb-1">4</div>
          <div className="pixel-text text-xs text-[#888]">TOTAL</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#10B981] mb-1">3</div>
          <div className="pixel-text text-xs text-[#888]">ACTIVE</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#EF4444] mb-1">1</div>
          <div className="pixel-text text-xs text-[#888]">EXPIRING</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-4 pixel-corners">
          <div className="pixel-text text-2xl text-[#888] mb-1">0</div>
          <div className="pixel-text text-xs text-[#888]">REVOKED</div>
        </div>
      </div>

      {/* Filters & Search */}
      <PixelCard className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vcId, issuer, or claims..."
              className="w-full bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners pl-10 pr-3 py-2 pixel-text text-xs text-white placeholder:text-[#555] focus:border-[#4F46E5] outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 border-4 pixel-corners whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-[#4F46E5] border-[#4F46E5]'
                    : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
              >
                <span className={`pixel-text text-xs ${
                  filter === f.id ? 'text-white' : 'text-[#888]'
                }`}>
                  {f.label} ({f.count})
                </span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="p-2 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5]">
              <Filter className="w-5 h-5 text-[#888]" />
            </button>
            <button className="p-2 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5]">
              <Download className="w-5 h-5 text-[#888]" />
            </button>
          </div>
        </div>
      </PixelCard>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockCredentials.map((credential) => (
          <CredentialCard
            key={credential.vcId}
            credential={credential}
            onClick={() => setSelectedCredential(credential)}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockCredentials.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners flex items-center justify-center">
            <Filter className="w-10 h-10 text-[#888]" />
          </div>
          <div className="pixel-text text-sm text-[#888] mb-4">No credentials found</div>
          <PixelButton variant="primary">
            <Plus className="w-4 h-4 inline mr-2" />
            ADD CREDENTIAL
          </PixelButton>
        </div>
      )}

      {/* Modals */}
      {selectedCredential && (
        <CredentialDetailModal
          credential={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          userRole={userRole}
        />
      )}

      {isIssueModalOpen && (
        <IssueCredentialModal
          onClose={() => setIsIssueModalOpen(false)}
          onIssue={(data) => {
            console.log('Issue credential:', data);
            setIsIssueModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
