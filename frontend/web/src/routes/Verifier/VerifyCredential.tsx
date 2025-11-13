import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { apiClient } from '@/lib/apiClient';
import { config } from '@/config/env';
import type { VerifyCredentialRequest, VerifyCredentialResponse, VerifiableCredential } from '@/lib/types';

export const VerifyCredential: React.FC = () => {
  const [inputMode, setInputMode] = useState<'json' | 'hash' | 'id'>('json');
  const [vcJson, setVcJson] = useState('');
  const [vcHash, setVcHash] = useState('');
  const [vcId, setVcId] = useState('');
  const [result, setResult] = useState<VerifyCredentialResponse | null>(null);
  const [error, setError] = useState<string>('');

  const verifyMutation = useMutation({
    mutationFn: (data: VerifyCredentialRequest) => apiClient.verifyCredential(data),
    onSuccess: (data) => {
      setResult(data);
      setError('');
    },
    onError: (err: Error) => {
      setError(err.message || 'Verification failed');
      setResult(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    let requestData: VerifyCredentialRequest;

    if (inputMode === 'json') {
      try {
        const parsed: VerifiableCredential = JSON.parse(vcJson);
        requestData = { vc: parsed };
      } catch (err) {
        setError('Invalid JSON format');
        return;
      }
    } else if (inputMode === 'hash') {
      requestData = { vcHash };
    } else {
      requestData = { vcId };
    }

    verifyMutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Verify Credential</h1>

        <Card title="Input Method">
          <div className="mb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setInputMode('json')}
                className={`px-4 py-2 rounded-lg ${
                  inputMode === 'json'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Full VC JSON
              </button>
              <button
                type="button"
                onClick={() => setInputMode('hash')}
                className={`px-4 py-2 rounded-lg ${
                  inputMode === 'hash'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                VC Hash
              </button>
              <button
                type="button"
                onClick={() => setInputMode('id')}
                className={`px-4 py-2 rounded-lg ${
                  inputMode === 'id'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                VC ID
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputMode === 'json' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verifiable Credential JSON
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  rows={10}
                  value={vcJson}
                  onChange={(e) => setVcJson(e.target.value)}
                  placeholder='{"id": "...", "holderDid": "...", "issuerDid": "...", "type": [...], ...}'
                  required
                />
              </div>
            )}

            {inputMode === 'hash' && (
              <Input
                label="VC Hash"
                value={vcHash}
                onChange={(e) => setVcHash(e.target.value)}
                placeholder="0x..."
                required
              />
            )}

            {inputMode === 'id' && (
              <Input
                label="VC ID"
                value={vcId}
                onChange={(e) => setVcId(e.target.value)}
                placeholder="vc:..."
                required
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={verifyMutation.isPending}
            >
              Verify Credential
            </Button>
          </form>
        </Card>

        {result && (
          <Card title="Verification Result" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`px-4 py-2 rounded-lg text-lg font-bold ${
                    result.valid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.valid ? '✓ Valid' : '✗ Invalid'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">On-Chain Status:</span>
                  <p className="text-gray-900">{result.onChainStatus}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Expiry Status:</span>
                  <p className="text-gray-900">{result.expiryStatus}</p>
                </div>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">Reasons:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="text-gray-700">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.credential && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">
                    Credential Details:
                  </span>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>{' '}
                      {Array.isArray(result.credential.type)
                        ? result.credential.type.join(', ')
                        : result.credential.type}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {result.credential.status}
                    </div>
                    {result.credential.ipfsCid && (
                      <div>
                        <span className="font-medium">IPFS:</span>{' '}
                        <a
                          href={`${config.ipfsGatewayUrl}${result.credential.ipfsCid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {result.credential.ipfsCid}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

