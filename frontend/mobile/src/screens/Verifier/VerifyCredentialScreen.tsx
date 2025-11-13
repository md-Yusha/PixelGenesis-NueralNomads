import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { apiClient } from '../../lib/apiClient';
import { VerifyCredentialResponse } from '../../lib/types';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { MainTabsParamList } from '../../navigation/MainTabs';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProp = RouteProp<MainTabsParamList, 'Verify'>;

export function VerifyCredentialScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [vcJson, setVcJson] = useState('');
  const [vcHash, setVcHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerifyCredentialResponse | null>(
    null
  );

  useEffect(() => {
    // Handle prefill from QR scan
    if (route.params?.prefillJson) {
      setVcJson(route.params.prefillJson);
    } else if (route.params?.prefillHash) {
      setVcHash(route.params.prefillHash);
    }
  }, [route.params]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      let request: { credential?: any; credentialHash?: string } = {};

      if (vcJson.trim()) {
        try {
          const parsed = JSON.parse(vcJson);
          request.credential = parsed;
        } catch (error) {
          throw new Error('Invalid JSON format');
        }
      } else if (vcHash.trim()) {
        request.credentialHash = vcHash.trim();
      } else {
        throw new Error('Please provide either VC JSON or hash');
      }

      return apiClient.verifyCredential(request);
    },
    onSuccess: (data) => {
      setVerificationResult(data);
    },
    onError: (error: any) => {
      Alert.alert(
        'Verification Failed',
        error.message || error.response?.data?.detail || 'Failed to verify credential'
      );
      setVerificationResult(null);
    },
  });

  const handleVerify = () => {
    if (!vcJson.trim() && !vcHash.trim()) {
      Alert.alert('Error', 'Please provide either VC JSON or hash');
      return;
    }
    verifyMutation.mutate();
  };

  const handleScanQr = () => {
    navigation.navigate('ScanQr');
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <Button
          title="Scan QR Code"
          onPress={handleScanQr}
          variant="secondary"
          style={styles.scanButton}
        />

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Verify Credential</Text>
          <Text style={styles.instruction}>
            Enter either the full Verifiable Credential JSON or just the credential hash
          </Text>

          <Input
            label="VC JSON (optional)"
            value={vcJson}
            onChangeText={setVcJson}
            placeholder='{"id": "...", "holderDid": "...", ...}'
            multiline
            numberOfLines={6}
            style={styles.jsonInput}
          />

          <Text style={styles.orText}>OR</Text>

          <Input
            label="Credential Hash (optional)"
            value={vcHash}
            onChangeText={setVcHash}
            placeholder="0x..."
          />

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={verifyMutation.isPending}
            disabled={verifyMutation.isPending}
            style={styles.verifyButton}
          />
        </Card>

        {verificationResult && (
          <Card
            style={[
              styles.resultCard,
              verificationResult.valid ? styles.validCard : styles.invalidCard,
            ]}
          >
            <Text style={styles.resultTitle}>
              {verificationResult.valid ? '✓ Valid Credential' : '✗ Invalid Credential'}
            </Text>

            {verificationResult.reasons && verificationResult.reasons.length > 0 && (
              <View style={styles.reasonsContainer}>
                <Text style={styles.reasonsTitle}>Reasons:</Text>
                {verificationResult.reasons.map((reason, index) => (
                  <Text key={index} style={styles.reasonText}>
                    • {reason}
                  </Text>
                ))}
              </View>
            )}

            {verificationResult.credential && (
              <View style={styles.credentialInfo}>
                <Text style={styles.infoLabel}>Credential ID:</Text>
                <Text style={styles.infoValue} selectable>
                  {verificationResult.credential.id}
                </Text>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{verificationResult.credential.status}</Text>
              </View>
            )}
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanButton: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  jsonInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 8,
    fontSize: 14,
  },
  verifyButton: {
    marginTop: 8,
  },
  resultCard: {
    marginTop: 16,
  },
  validCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  invalidCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reasonsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  credentialInfo: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    marginTop: 4,
  },
});

