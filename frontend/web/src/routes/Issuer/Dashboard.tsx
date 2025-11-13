import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiClient } from '@/lib/apiClient';
import type { DID, CredentialRecord } from '@/lib/types';

export const IssuerDashboard: React.FC = () => {
  const { data: did, isLoading: didLoading } = useQuery({
    queryKey: ['my-did'],
    queryFn: () => apiClient.getMyDID(),
    enabled: !!apiClient.getToken(),
    retry: false,
  });

  const { data: credentials, isLoading: credentialsLoading } = useQuery({
    queryKey: ['my-credentials'],
    queryFn: () => apiClient.getMyCredentials(),
    enabled: !!apiClient.getToken(),
  });

  const issuedCount = credentials?.filter((c) => c.issuerDid === did?.did).length || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={[
          { label: 'Dashboard', path: '/issuer/dashboard' },
          { label: 'Issue Credential', path: '/issuer/issue' },
        ]}
      />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Issuer Dashboard</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card title="Issuer DID">
              {didLoading ? (
                <Loader />
              ) : did ? (
                <div className="space-y-2">
                  <p className="text-gray-900 font-mono text-sm break-all">{did.did}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(did.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No DID found</p>
              )}
            </Card>

            <Card title="Statistics">
              {credentialsLoading ? (
                <Loader />
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="text-3xl font-bold text-primary-600">{issuedCount}</span>
                    <p className="text-sm text-gray-600">Credentials Issued</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

