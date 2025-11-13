import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiClient } from '@/lib/apiClient';
import { config } from '@/config/env';
import type { IssueCredentialRequest } from '@/lib/types';

export const IssueCredential: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IssueCredentialRequest>({
    holderDid: '',
    type: ['VerifiableCredential'], // Start with base type
    claims: {},
    expiresAt: null,
  });
  const [typeInput, setTypeInput] = useState(''); // For adding additional types
  const [claimKey, setClaimKey] = useState('');
  const [claimValue, setClaimValue] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<{ txHash: string; vcId: string } | null>(null);

  const issueMutation = useMutation({
    mutationFn: (data: IssueCredentialRequest) => apiClient.issueCredential(data),
    onSuccess: (data) => {
      setSuccess({
        txHash: data.transactionHash,
        vcId: data.credential.vcId,
      });
      setError('');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to issue credential');
    },
  });

  const handleAddClaim = () => {
    if (claimKey && claimValue) {
      setFormData({
        ...formData,
        claims: {
          ...formData.claims,
          [claimKey]: claimValue,
        },
      });
      setClaimKey('');
      setClaimValue('');
    }
  };

  const handleRemoveClaim = (key: string) => {
    const newClaims = { ...formData.claims };
    delete newClaims[key];
    setFormData({ ...formData, claims: newClaims });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.type.length === 0 || !formData.type.includes('VerifiableCredential')) {
      setError('At least "VerifiableCredential" type is required');
      return;
    }
    
    const submitData: IssueCredentialRequest = {
      ...formData,
      expiresAt: formData.expiresAt || null,
    };
    issueMutation.mutate(submitData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={[
          { label: 'Dashboard', path: '/issuer/dashboard' },
          { label: 'Issue Credential', path: '/issuer/issue' },
        ]}
      />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Issue Credential</h1>

          {success ? (
            <Card>
              <div className="text-center py-8">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Credential Issued!</h2>
                <div className="space-y-2 mb-6">
                  <p>
                    <span className="font-medium">VC ID:</span>{' '}
                    <span className="font-mono text-sm">{success.vcId}</span>
                  </p>
                  <p>
                    <span className="font-medium">Transaction:</span>{' '}
                    <a
                      href={`${config.rpcUrl}/tx/${success.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-mono text-sm"
                    >
                      {success.txHash}
                    </a>
                  </p>
                </div>
                <div className="flex space-x-4 justify-center">
                  <Button variant="primary" onClick={() => navigate('/issuer/dashboard')}>
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(null);
                      setFormData({
                        holderDid: '',
                        type: ['VerifiableCredential'],
                        claims: {},
                        expiresAt: null,
                      });
                      setTypeInput('');
                    }}
                  >
                    Issue Another
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Credential Details">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <Input
                  label="Holder DID"
                  required
                  value={formData.holderDid}
                  onChange={(e) => setFormData({ ...formData, holderDid: e.target.value })}
                  placeholder="did:ethr:0x..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential Types
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add type (e.g., KYC, Aadhaar, Degree)"
                      value={typeInput}
                      onChange={(e) => setTypeInput(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (typeInput.trim() && !formData.type.includes(typeInput.trim())) {
                            setFormData({
                              ...formData,
                              type: [...formData.type, typeInput.trim()],
                            });
                            setTypeInput('');
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (typeInput.trim() && !formData.type.includes(typeInput.trim())) {
                          setFormData({
                            ...formData,
                            type: [...formData.type, typeInput.trim()],
                          });
                          setTypeInput('');
                        }
                      }}
                    >
                      Add Type
                    </Button>
                  </div>
                  {formData.type.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.type.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {t}
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  type: formData.type.filter((_, i) => i !== idx),
                                });
                              }}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Base type "VerifiableCredential" is required and cannot be removed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Claims</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Key"
                      value={claimKey}
                      onChange={(e) => setClaimKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={claimValue}
                      onChange={(e) => setClaimValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddClaim}>
                      Add
                    </Button>
                  </div>
                  {Object.keys(formData.claims).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(formData.claims).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                        >
                          <span className="text-sm">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveClaim(key)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  label="Expiration Date (optional)"
                  type="datetime-local"
                  value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={issueMutation.isPending}
                >
                  Issue Credential
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

