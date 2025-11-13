import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/common/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiClient } from '@/lib/apiClient';
import { config } from '@/config/env';
import type { CredentialRecord } from '@/lib/types';

export const MyCredentials: React.FC = () => {
  const [selectedVC, setSelectedVC] = useState<CredentialRecord | null>(null);

  const { data: credentials, isLoading } = useQuery({
    queryKey: ['my-credentials'],
    queryFn: () => apiClient.getMyCredentials(),
    enabled: !!apiClient.getToken(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={[
          { label: 'Dashboard', path: '/holder/dashboard' },
          { label: 'My Credentials', path: '/holder/credentials' },
        ]}
      />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Credentials</h1>

          {isLoading ? (
            <Loader size="lg" />
          ) : !credentials || credentials.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-600">You don't have any credentials yet</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {credentials.map((credential) => (
                <Card key={credential.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {Array.isArray(credential.type)
                              ? credential.type.filter((t) => t !== 'VerifiableCredential').join(', ') || 'VerifiableCredential'
                              : credential.type}
                          </h3>
                          {Array.isArray(credential.type) && credential.type.length > 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Types: {credential.type.join(', ')}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                            credential.status
                          )}`}
                        >
                          {credential.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">VC ID:</span>
                          <p className="text-gray-900 font-mono text-xs break-all">
                            {credential.vcId}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Issuer DID:</span>
                          <p className="text-gray-900 font-mono text-xs break-all">
                            {credential.issuerDid}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Issued At:</span>
                          <p className="text-gray-900">
                            {new Date(credential.issuedAt).toLocaleString()}
                          </p>
                        </div>
                        {credential.expiresAt && (
                          <div>
                            <span className="text-gray-500">Expires At:</span>
                            <p className="text-gray-900">
                              {new Date(credential.expiresAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {credential.onChainTxHash && (
                          <div>
                            <span className="text-gray-500">Transaction:</span>
                            <a
                              href={`${config.rpcUrl}/tx/${credential.onChainTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 font-mono text-xs break-all"
                            >
                              {credential.onChainTxHash.slice(0, 20)}...
                            </a>
                          </div>
                        )}
                        {credential.ipfsCid && (
                          <div>
                            <span className="text-gray-500">IPFS:</span>
                            <a
                              href={`${config.ipfsGatewayUrl}${credential.ipfsCid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 font-mono text-xs break-all"
                            >
                              {credential.ipfsCid}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVC(credential)}
                    >
                      View JSON
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* VC JSON Modal */}
          {selectedVC && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Credential JSON</h2>
                    <Button variant="outline" size="sm" onClick={() => setSelectedVC(null)}>
                      Close
                    </Button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(selectedVC.vc, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

