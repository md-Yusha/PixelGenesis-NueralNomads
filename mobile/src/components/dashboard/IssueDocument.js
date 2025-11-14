import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { ethers } from 'ethers';
import { getCredentialManagerContract } from '../../utils/web3';
import { uploadToIPFS } from '../../utils/ipfs';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const IssueDocument = ({ account }) => {
  const [subjectAddress, setSubjectAddress] = useState('');
  const [credentialName, setCredentialName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const pickFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedFile(result.assets[0]);
      if (!credentialName) {
        const fileName = result.assets[0].uri.split('/').pop();
        setCredentialName(fileName.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleIssue = async () => {
    if (!subjectAddress.trim()) {
      Alert.alert('Error', 'Recipient address is required');
      return;
    }

    if (!ethers.isAddress(subjectAddress)) {
      Alert.alert('Error', 'Invalid Ethereum address');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const normalizedSubject = ethers.getAddress(subjectAddress.trim());
      const normalizedIssuer = ethers.getAddress(account);
      
      setMessage({ type: 'info', text: 'Uploading file to secure storage...' });
      const ipfsHash = await uploadToIPFS(selectedFile.uri, selectedFile.fileName || credentialName);
      
      const credentialIdData = `${normalizedIssuer}${normalizedSubject}${Date.now()}${credentialName}`;
      const credentialId = ethers.id(credentialIdData);
      
      setMessage({ type: 'info', text: 'Issuing credential on blockchain...' });
      const contract = await getCredentialManagerContract();
      const tx = await contract.issueCredential(
        normalizedSubject,
        ipfsHash,
        credentialId
      );
      const receipt = await tx.wait();
      
      if (receipt.status !== 1) {
        throw new Error('Transaction failed! Status: ' + receipt.status);
      }
      
      setMessage({ type: 'success', text: 'Credential issued successfully!' });
      setSubjectAddress('');
      setCredentialName('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error issuing credential:', error);
      setMessage({ type: 'error', text: `Failed to issue credential: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Issue Document</Text>
      <Text style={styles.description}>
        Issue a credential to a recipient. The document will be stored securely on IPFS and recorded on the blockchain.
      </Text>

      {message && (
        <View style={[
          styles.message,
          message.type === 'error' ? styles.errorMessage : 
          message.type === 'success' ? styles.successMessage : styles.infoMessage
        ]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="0x..."
            placeholderTextColor="#666666"
            value={subjectAddress}
            onChangeText={setSubjectAddress}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Credential Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter credential name"
            placeholderTextColor="#666666"
            value={credentialName}
            onChangeText={setCredentialName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document File</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickFile}>
            {selectedFile ? (
              <View style={styles.filePreview}>
                <Icon name="file-document" size={48} color="#00ffff" />
                <Text style={styles.fileName}>{selectedFile.fileName || 'Selected File'}</Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="cloud-upload" size={64} color="#666666" />
                <Text style={styles.uploadText}>Tap to select a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, (!subjectAddress.trim() || !selectedFile || loading) && styles.disabledButton]}
          onPress={handleIssue}
          disabled={!subjectAddress.trim() || !selectedFile || loading}
        >
          <Icon name="certificate" size={20} color="#0a0a0f" />
          <Text style={styles.buttonText}>
            {loading ? 'Issuing...' : 'Issue Credential'}
          </Text>
        </TouchableOpacity>
      </View>
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
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.5)',
  },
  successMessage: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.5)',
  },
  infoMessage: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cccccc',
    marginBottom: 8,
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
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#444444',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
  },
  filePreview: {
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#00ffff',
    marginTop: 12,
    fontWeight: 'bold',
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
});

export default IssueDocument;

