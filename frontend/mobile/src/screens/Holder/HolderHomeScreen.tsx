import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/authStore';

export function HolderHomeScreen() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: didInfo, isLoading, error } = useQuery({
    queryKey: ['myDID'],
    queryFn: () => apiClient.getMyDID(),
    retry: false,
  });

  const createDIDMutation = useMutation({
    mutationFn: () => apiClient.createDID(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDID'] });
      Alert.alert('Success', 'DID created successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create DID');
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <Card style={styles.userCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role}</Text>
        </Card>

        <Card style={styles.didCard}>
          <Text style={styles.sectionTitle}>Your DID</Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : error ? (
            <View>
              <Text style={styles.errorText}>No DID found</Text>
              <Button
                title="Generate DID"
                onPress={() => createDIDMutation.mutate()}
                loading={createDIDMutation.isPending}
                style={styles.generateButton}
              />
            </View>
          ) : didInfo ? (
            <View>
              <Text style={styles.didText}>{didInfo.did}</Text>
              {didInfo.walletAddress && (
                <>
                  <Text style={styles.label}>Wallet Address</Text>
                  <Text style={styles.walletText}>{didInfo.walletAddress}</Text>
                </>
              )}
              <Text style={styles.metaText}>
                Created: {new Date(didInfo.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ) : null}
        </Card>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userCard: {
    marginBottom: 16,
  },
  didCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  didText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  walletText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 12,
  },
  generateButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 24,
  },
});

