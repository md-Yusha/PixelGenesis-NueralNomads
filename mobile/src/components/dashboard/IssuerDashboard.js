import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ethers } from 'ethers';
import { getCredentialManagerContractReadOnly } from '../../utils/web3';
import { formatAddress, formatDate } from '../../utils/helpers';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const IssuerDashboard = ({ account }) => {
  const [issuedCredentials, setIssuedCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeCredentials: 0,
    revokedCredentials: 0,
  });

  useEffect(() => {
    loadIssuedCredentials();
  }, [account]);

  const loadIssuedCredentials = async () => {
    if (!account || !account.startsWith('0x')) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const contract = getCredentialManagerContractReadOnly();
      const normalizedAccount = ethers.getAddress(account);
      const credentialIds = await contract.getCredentialsByIssuer(normalizedAccount);
      
      const credentialPromises = credentialIds.map(async (id) => {
        try {
          const cred = await contract.getCredential(id);
          return {
            id,
            subject: cred.subject,
            ipfsHash: cred.ipfsHash,
            issuedAt: cred.issuedAt,
            isRevoked: cred.isRevoked,
            revokedAt: cred.revokedAt,
          };
        } catch (err) {
          return null;
        }
      });
      
      const creds = (await Promise.all(credentialPromises)).filter(c => c !== null);
      setIssuedCredentials(creds);
      
      // Calculate stats
      const total = creds.length;
      const active = creds.filter(c => !c.isRevoked).length;
      const revoked = creds.filter(c => c.isRevoked).length;
      
      setStats({
        totalIssued: total,
        activeCredentials: active,
        revokedCredentials: revoked,
      });
    } catch (error) {
      console.error('Error loading issued credentials:', error);
      setIssuedCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Issuer Dashboard</Text>
      <Text style={styles.description}>
        Manage and view all credentials you have issued.
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="certificate" size={32} color="#00ffff" />
          <Text style={styles.statValue}>{stats.totalIssued}</Text>
          <Text style={styles.statLabel}>Total Issued</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={32} color="#00ff00" />
          <Text style={styles.statValue}>{stats.activeCredentials}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="close-circle" size={32} color="#ff0000" />
          <Text style={styles.statValue}>{stats.revokedCredentials}</Text>
          <Text style={styles.statLabel}>Revoked</Text>
        </View>
      </View>

      {/* Credentials List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading credentials...</Text>
        </View>
      ) : issuedCredentials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="certificate-outline" size={64} color="#666666" />
          <Text style={styles.emptyText}>No credentials issued yet</Text>
          <Text style={styles.emptySubtext}>Start issuing credentials to recipients</Text>
        </View>
      ) : (
        <View style={styles.credentialsList}>
          {issuedCredentials.map((cred, index) => (
            <View key={index} style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Icon 
                  name={cred.isRevoked ? 'certificate' : 'certificate'} 
                  size={24} 
                  color={cred.isRevoked ? '#ff0000' : '#00ffff'} 
                />
                <View style={styles.credentialInfo}>
                  <Text style={styles.credentialId}>
                    {cred.id.substring(0, 16)}...
                  </Text>
                  <Text style={styles.credentialSubject}>
                    To: {formatAddress(cred.subject)}
                  </Text>
                  <Text style={styles.credentialDate}>
                    Issued: {formatDate(cred.issuedAt)}
                  </Text>
                  {cred.isRevoked && (
                    <Text style={styles.revokedDate}>
                      Revoked: {formatDate(cred.revokedAt)}
                    </Text>
                  )}
                </View>
              </View>
              {cred.isRevoked && (
                <View style={styles.revokedBadge}>
                  <Text style={styles.revokedText}>REVOKED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999999',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  credentialsList: {
  },
  credentialCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  credentialInfo: {
    flex: 1,
  },
  credentialId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  credentialSubject: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  credentialDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  revokedDate: {
    fontSize: 12,
    color: '#ff0000',
  },
  revokedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#ff0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  revokedText: {
    color: '#ff0000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default IssuerDashboard;

