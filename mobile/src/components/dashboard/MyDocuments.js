import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { ethers } from 'ethers';
import { getCredentialManagerContractReadOnly } from '../../utils/web3';
import { formatAddress, formatDate } from '../../utils/helpers';
import { getIPFSFileUrl } from '../../utils/ipfs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const MyDocuments = ({ account }) => {
  const [credentials, setCredentials] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [account]);

  const loadPersonalDocuments = () => {
    try {
      AsyncStorage.getItem('personalDocuments').then(docs => {
        const parsedDocs = JSON.parse(docs || '[]');
        const userDocs = parsedDocs.filter(doc => 
          doc.owner && doc.owner.toLowerCase() === account.toLowerCase()
        );
        setPersonalDocuments(userDocs);
      });
    } catch (error) {
      console.error('Error loading personal documents:', error);
      setPersonalDocuments([]);
    }
  };

  const loadCredentials = async () => {
    if (!account || !account.startsWith('0x')) {
      setLoading(false);
      setCredentials([]);
      return;
    }

    setLoading(true);
    try {
      const contract = getCredentialManagerContractReadOnly();
      const normalizedAccount = ethers.getAddress(account);
      const credentialIds = await contract.getCredentialsBySubject(normalizedAccount);
      
      const credentialPromises = credentialIds.map(async (id) => {
        try {
          const cred = await contract.getCredential(id);
          return {
            id,
            name: `Credential ${id.substring(0, 8)}...`,
            ipfsHash: cred.ipfsHash,
            type: 'credential',
            issuer: cred.issuer,
            issuedAt: cred.issuedAt,
            isRevoked: cred.isRevoked,
          };
        } catch (err) {
          return null;
        }
      });
      
      const creds = (await Promise.all(credentialPromises)).filter(c => c !== null);
      setCredentials(creds);
    } catch (error) {
      console.error('Error loading credentials:', error);
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    await Promise.all([loadCredentials(), loadPersonalDocuments()]);
  };

  const handleDownload = async (document) => {
    try {
      const ipfsUrl = getIPFSFileUrl(document.ipfsHash);
      const downloadPath = `${FileSystem.documentDirectory}${document.name || 'document'}`;
      
      const downloadResult = await FileSystem.downloadAsync(ipfsUrl, downloadPath);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Success', 'File downloaded to: ' + downloadPath);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Error', 'Failed to download document: ' + error.message);
    }
  };

  const allDocuments = [...credentials, ...personalDocuments];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Documents</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : allDocuments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-document-outline" size={64} color="#666666" />
          <Text style={styles.emptyText}>No documents found</Text>
          <Text style={styles.emptySubtext}>Upload documents or wait for issuers to issue credentials</Text>
        </View>
      ) : (
        <View style={styles.documentsList}>
          {allDocuments.map((doc, index) => (
            <View key={index} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <Icon 
                  name={doc.type === 'credential' ? 'certificate' : 'file-document'} 
                  size={24} 
                  color={doc.isRevoked ? '#ff0000' : '#00ffff'} 
                />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentType}>{doc.type === 'credential' ? 'Credential' : 'Personal Document'}</Text>
                  {doc.issuedAt && (
                    <Text style={styles.documentDate}>{formatDate(doc.issuedAt)}</Text>
                  )}
                  {doc.issuer && (
                    <Text style={styles.documentIssuer}>Issued by: {formatAddress(doc.issuer)}</Text>
                  )}
                </View>
              </View>
              {doc.isRevoked && (
                <View style={styles.revokedBadge}>
                  <Text style={styles.revokedText}>REVOKED</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload(doc)}
                disabled={doc.isRevoked}
              >
                <Icon name="download" size={20} color="#ffffff" />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
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
    marginBottom: 16,
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
  documentsList: {
  },
  documentCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  documentDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  documentIssuer: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  revokedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#ff0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  revokedText: {
    color: '#ff0000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ffff',
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadText: {
    color: '#0a0a0f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyDocuments;

