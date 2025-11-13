import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { apiClient } from '../../lib/apiClient';
import { VerifiableCredential, CredentialStatus } from '../../lib/types';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function MyCredentialsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { data: credentials, isLoading, error } = useQuery({
    queryKey: ['myCredentials'],
    queryFn: () => apiClient.getMyCredentials(),
  });

  const getStatusColor = (status: CredentialStatus) => {
    return status === CredentialStatus.ACTIVE ? '#34C759' : '#FF3B30';
  };

  const renderCredential = ({ item }: { item: VerifiableCredential }) => {
    const credentialTypes = item.type.filter((t) => t !== 'VerifiableCredential').join(', ');

    return (
      <Card
        onPress={() => navigation.navigate('CredentialDetail', { credentialId: item.id })}
      >
        <View style={styles.credentialHeader}>
          <Text style={styles.credentialType}>{credentialTypes || 'Credential'}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.issuerLabel}>Issuer</Text>
        <Text style={styles.issuerDid} numberOfLines={1}>
          {item.issuerDid}
        </Text>
        <Text style={styles.dateText}>
          Issued: {new Date(item.issuedAt).toLocaleDateString()}
        </Text>
        {item.expiresAt && (
          <Text style={styles.dateText}>
            Expires: {new Date(item.expiresAt).toLocaleDateString()}
          </Text>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading credentials...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load credentials</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!credentials || credentials.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No credentials found</Text>
          <Text style={styles.emptySubtext}>
            Your verifiable credentials will appear here
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={credentials}
        renderItem={renderCredential}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  credentialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  credentialType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  issuerLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  issuerDid: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

