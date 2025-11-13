import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiClient } from '@/lib/apiClient';
import type { DID } from '@/lib/types';

export const HolderDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string>('');

  const { data: did, isLoading: didLoading, refetch: refetchDID } = useQuery({
    queryKey: ['my-did'],
    queryFn: () => apiClient.getMyDID(),
    enabled: !!apiClient.getToken(),
    retry: false,
  });

  const createDIDMutation = useMutation({
    mutationFn: () => apiClient.createDID(),
    onSuccess: () => {
      refetchDID();
      setError('');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to generate DID');
    },
  });

  const handleGenerateDID = () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }
    createDIDMutation.mutate();
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Holder Dashboard</h1>

          {!isConnected && (
            <Card className="mb-6">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please connect your wallet to continue</p>
              </div>
            </Card>
          )}

          {isConnected && (
            <>
              <Card title="Wallet Information" className="mb-6">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <p className="text-gray-900 font-mono text-sm break-all">{address}</p>
                  </div>
                </div>
              </Card>

              <Card title="DID Information" className="mb-6">
                {didLoading ? (
                  <Loader />
                ) : did ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">DID:</span>
                      <p className="text-gray-900 font-mono text-sm break-all">{did.did}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Public Key:</span>
                      <p className="text-gray-900 font-mono text-sm break-all">{did.publicKey}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created At:</span>
                      <p className="text-gray-900">
                        {new Date(did.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">You don't have a DID yet</p>
                    <Button
                      variant="primary"
                      onClick={handleGenerateDID}
                      isLoading={createDIDMutation.isPending}
                    >
                      Generate DID
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

