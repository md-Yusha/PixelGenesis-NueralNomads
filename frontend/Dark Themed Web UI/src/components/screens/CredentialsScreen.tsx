import { useState } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { CredentialCard } from '../ui/CredentialCard';
import { StatusPill } from '../ui/StatusPill';
import { FAB } from '../ui/FAB';
import { CredentialDetailModal } from '../modals/CredentialDetailModal';
import { IssueCredentialModal } from '../modals/IssueCredentialModal';
import { Search, Filter } from 'lucide-react';

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
  ];

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: 3 },
    { id: 'active', label: 'Active', count: 2 },
    { id: 'revoked', label: 'Revoked', count: 0 },
    { id: 'expiring', label: 'Expiring', count: 1 },
  ];

  return (
    <div className="p-4 space-y-4 bg-[#0f0f0f] pb-24">
      {/* Search & Filter */}
      <PixelCard>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vcId, issuer..."
              className="w-full bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners pl-10 pr-3 py-2 pixel-text text-xs text-white placeholder:text-[#555] focus:border-[#4F46E5] outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-2 border-4 pixel-corners whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-[#4F46E5] border-[#4F46E5]'
                    : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
              >
                <span className={`pixel-text text-[10px] ${
                  filter === f.id ? 'text-white' : 'text-[#888]'
                }`}>
                  {f.label} ({f.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </PixelCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-white">3</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">TOTAL</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-[#10B981]">2</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">ACTIVE</div>
        </div>
        <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] p-3 pixel-corners">
          <div className="pixel-text text-lg text-[#EF4444]">1</div>
          <div className="pixel-text text-[8px] text-[#888] mt-1">EXPIRING</div>
        </div>
      </div>

      {/* Credentials List */}
      <div className="space-y-3">
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
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners flex items-center justify-center">
            <Filter className="w-10 h-10 text-[#888]" />
          </div>
          <div className="pixel-text text-xs text-[#888]">No credentials found</div>
        </div>
      )}

      {/* FAB for Issue (Issuer only) */}
      {userRole === 'issuer' && (
        <FAB onClick={() => setIsIssueModalOpen(true)} />
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
