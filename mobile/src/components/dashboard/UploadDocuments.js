import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToIPFS } from '../../utils/ipfs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const UploadDocuments = ({ account }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const pickImage = async () => {
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
      if (!documentName) {
        const fileName = result.assets[0].uri.split('/').pop();
        setDocumentName(fileName.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    if (!documentName.trim()) {
      Alert.alert('Error', 'Please enter a document name');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      setMessage({ type: 'info', text: 'Uploading file to secure storage...' });
      const ipfsHash = await uploadToIPFS(selectedFile.uri, selectedFile.fileName || documentName);
      
      // Save to local storage
      const existingDocs = JSON.parse(await AsyncStorage.getItem('personalDocuments') || '[]');
      const newDoc = {
        id: Date.now().toString(),
        name: documentName,
        ipfsHash,
        owner: account,
        uploadedAt: Date.now(),
        type: 'personal',
      };
      existingDocs.push(newDoc);
      await AsyncStorage.setItem('personalDocuments', JSON.stringify(existingDocs));

      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setSelectedFile(null);
      setDocumentName('');
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessage({ type: 'error', text: `Failed to upload: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Upload Documents</Text>
      <Text style={styles.description}>
        Upload your personal documents to secure storage. You maintain full control.
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
        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
          {selectedFile ? (
            <View style={styles.filePreview}>
              <Icon name="file-document" size={48} color="#00ffff" />
              <Text style={styles.fileName}>{selectedFile.fileName || 'Selected File'}</Text>
              <Text style={styles.fileSize}>
                {selectedFile.fileSize ? `${(selectedFile.fileSize / 1024).toFixed(2)} KB` : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Icon name="cloud-upload" size={64} color="#666666" />
              <Text style={styles.uploadText}>Tap to select a file</Text>
              <Text style={styles.uploadHint}>Supports images and documents</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter document name"
              placeholderTextColor="#666666"
              value={documentName}
              onChangeText={setDocumentName}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (!selectedFile || !documentName.trim() || loading) && styles.disabledButton]}
          onPress={handleUpload}
          disabled={!selectedFile || !documentName.trim() || loading}
        >
          <Icon name="upload" size={20} color="#0a0a0f" />
          <Text style={styles.buttonText}>
            {loading ? 'Uploading...' : 'Upload Document'}
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
  uploadArea: {
    borderWidth: 2,
    borderColor: '#444444',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 200,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#666666',
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
  fileSize: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
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
  inputContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  input: {
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
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

export default UploadDocuments;

