import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { ethers } from 'ethers';
import { getCredentialManagerContractReadOnly } from '../../utils/web3';
import { formatAddress } from '../../utils/helpers';
import { getIPFSFileUrl } from '../../utils/ipfs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const ShareCredentials = ({ account }) => {
  const [credentials, setCredentials] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [account]);

  const loadDocuments = async () => {
    // Load credentials
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
            issuer: cred.issuer
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
    }

    // Load personal documents
    try {
      const docs = JSON.parse(await AsyncStorage.getItem('personalDocuments') || '[]');
      const userDocs = docs
        .filter(doc => doc.owner && doc.owner.toLowerCase() === account.toLowerCase())
        .map(doc => ({
          id: doc.ipfsHash,
          name: doc.name || 'Personal Document',
          ipfsHash: doc.ipfsHash,
          type: 'personal'
        }));
      setPersonalDocuments(userDocs);
    } catch (error) {
      console.error('Error loading personal documents:', error);
      setPersonalDocuments([]);
    }
  };

  const allDocuments = [...credentials, ...personalDocuments];

  const handleGenerateQR = async () => {
    if (!selectedDocument) {
      Alert.alert('Error', 'Please select a document to share');
      return;
    }

    if (!recipientAddress.trim()) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }

    if (!ethers.isAddress(recipientAddress.trim())) {
      Alert.alert('Error', 'Invalid Ethereum address');
      return;
    }

    setLoading(true);

    try {
      const normalizedRecipient = ethers.getAddress(recipientAddress.trim());
      
      const shareData = {
        documentId: selectedDocument.id,
        documentName: selectedDocument.name,
        ipfsHash: selectedDocument.ipfsHash,
        documentType: selectedDocument.type,
        sender: account,
        recipient: normalizedRecipient,
        timestamp: Date.now(),
        ipfsUrl: getIPFSFileUrl(selectedDocument.ipfsHash)
      };

      setQrCodeData(JSON.stringify(shareData));
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Share Credentials</Text>
      <Text style={styles.description}>
        Generate a QR code to share your documents securely.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Select Document</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.documentsList}>
          {allDocuments.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.documentOption,
                selectedDocument?.id === doc.id && styles.selectedDocument
              ]}
              onPress={() => setSelectedDocument(doc)}
            >
              <Icon 
                name={doc.type === 'credential' ? 'certificate' : 'file-document'} 
                size={24} 
                color={selectedDocument?.id === doc.id ? '#00ffff' : '#666666'} 
              />
              <Text style={[
                styles.documentOptionText,
                selectedDocument?.id === doc.id && styles.selectedDocumentText
              ]}>
                {doc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {allDocuments.length === 0 && (
          <Text style={styles.emptyText}>No documents available to share</Text>
        )}
      </View>

      {selectedDocument && (
        <View style={styles.card}>
          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="0x..."
            placeholderTextColor="#666666"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
          />

          <TouchableOpacity
            style={[styles.button, (!recipientAddress.trim() || loading) && styles.disabledButton]}
            onPress={handleGenerateQR}
            disabled={!recipientAddress.trim() || loading}
          >
            <Icon name="qrcode" size={20} color="#0a0a0f" />
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {qrCodeData && (
        <View style={styles.card}>
          <Text style={styles.label}>Share QR Code</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrCodeData}
              size={250}
              color="#00ffff"
              backgroundColor="#0a0a0f"
            />
          </View>
          <Text style={styles.qrHint}>
            Scan this QR code to access the shared document
          </Text>
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
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cccccc',
    marginBottom: 12,
  },
  documentsList: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  documentOption: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
    minWidth: 100,
  },
  selectedDocument: {
    borderColor: '#00ffff',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  documentOptionText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedDocumentText: {
    color: '#00ffff',
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ffff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0a0f',
    borderRadius: 12,
    marginBottom: 12,
  },
  qrHint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default ShareCredentials;

