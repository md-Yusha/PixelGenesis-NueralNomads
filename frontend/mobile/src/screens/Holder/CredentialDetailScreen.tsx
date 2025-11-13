import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { apiClient } from '../../lib/apiClient';
import { VerifiableCredential, CredentialStatus } from '../../lib/types';
import { config } from '../../config/env';
import { RootStackParamList } from '../../navigation/RootNavigator';

type RouteProp = RouteProp<RootStackParamList, 'CredentialDetail'>;

export function CredentialDetailScreen() {
  const route = useRoute<RouteProp>();
  const { credentialId } = route.params;

  const { data: credentials } = useQuery({
    queryKey: ['myCredentials'],
    queryFn: () => apiClient.getMyCredentials(),
  });

  const credential = useMemo(() => {
    return credentials?.find((c) => c.id === credentialId);
  }, [credentials, credentialId]);

  const handleOpenDocument = () => {
    if (!credential?.storage_cid) {
      Alert.alert('Error', 'No document CID available');
      return;
    }

    const url = `${config.PIXELGENESIS_IPFS_GATEWAY_URL}/${credential.storage_cid}`;
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Failed to open document');
      console.error(err);
    });
  };

  if (!credential) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Credential not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  const credentialTypes = credential.type.filter((t) => t !== 'VerifiableCredential');

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Credential Information</Text>

          <View style={styles.field}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value} selectable>
              {credential.id}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{credentialTypes.join(', ')}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    credential.status === CredentialStatus.ACTIVE ? '#34C759' : '#FF3B30',
                },
              ]}
            >
              <Text style={styles.statusText}>{credential.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Issued At</Text>
            <Text style={styles.value}>
              {new Date(credential.issuedAt).toLocaleString()}
            </Text>
          </View>

          {credential.expiresAt && (
            <View style={styles.field}>
              <Text style={styles.label}>Expires At</Text>
              <Text style={styles.value}>
                {new Date(credential.expiresAt).toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Holder DID</Text>
            <Text style={styles.value} selectable>
              {credential.holderDid}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Issuer DID</Text>
            <Text style={styles.value} selectable>
              {credential.issuerDid}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Claims</Text>
          {Object.entries(credential.claims).map(([key, value]) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.value}>
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </Text>
            </View>
          ))}
        </Card>

        {credential.proof && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Proof</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{credential.proof.type}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.value}>
                {new Date(credential.proof.created).toLocaleString()}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Verification Method</Text>
              <Text style={styles.value} selectable>
                {credential.proof.verificationMethod}
              </Text>
            </View>
          </Card>
        )}

        {credential.storage_cid && (
          <Button
            title="Open Document"
            onPress={handleOpenDocument}
            style={styles.documentButton}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  documentButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
});

