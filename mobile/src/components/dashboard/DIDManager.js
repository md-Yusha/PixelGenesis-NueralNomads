import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getDIDRegistryContract, getDIDRegistryContractReadOnly } from '../../utils/web3';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const DIDManager = ({ account }) => {
  const [did, setDid] = useState('');
  const [hasDID, setHasDID] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDID, setNewDID] = useState('');

  useEffect(() => {
    loadDID();
  }, [account]);

  const loadDID = useCallback(async () => {
    if (!account || !account.startsWith('0x')) return;

    setLoading(true);
    setMessage(null);
    try {
      const contract = getDIDRegistryContractReadOnly();
      const contractAddress = contract.target || contract.address;
      if (!contractAddress || contractAddress === '0x' || contractAddress === '') {
        console.warn('DIDRegistry contract address not configured');
        setHasDID(false);
        setDid('');
        setNewDID('');
        return;
      }

      const hasRegistered = await contract.hasDID(account);
      setHasDID(hasRegistered);
      if (hasRegistered) {
        const registeredDID = await contract.getDID(account);
        if (registeredDID && registeredDID.trim() !== '') {
          setDid(registeredDID);
          setNewDID(registeredDID);
        } else {
          setHasDID(false);
          setDid('');
          setNewDID('');
        }
      } else {
        setDid('');
        setNewDID('');
      }
    } catch (error) {
      console.error('Error loading DID:', error);
      if (error.message && (
        error.message.includes('contract address not set') ||
        error.message.includes('contract does not exist')
      )) {
        setHasDID(false);
        setDid('');
        setNewDID('');
        setMessage({ 
          type: 'error', 
          text: 'Contract not found. Please make sure contracts are deployed.' 
        });
      }
    } finally {
      setLoading(false);
    }
  }, [account]);

  const handleRegister = async () => {
    if (!newDID.trim()) {
      Alert.alert('Error', 'DID cannot be empty');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const contract = await getDIDRegistryContract();
      const tx = await contract.registerDID(newDID.trim());
      await tx.wait();

      await loadDID();
      setMessage({ type: 'success', text: 'DID registered successfully!' });
    } catch (error) {
      console.error('Error registering DID:', error);
      setMessage({ type: 'error', text: `Failed to register DID: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newDID.trim()) {
      Alert.alert('Error', 'DID cannot be empty');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const contract = await getDIDRegistryContract();
      const tx = await contract.updateDID(newDID.trim());
      await tx.wait();

      await loadDID();
      setIsEditing(false);
      setMessage({ type: 'success', text: 'DID updated successfully!' });
    } catch (error) {
      console.error('Error updating DID:', error);
      setMessage({ type: 'error', text: `Failed to update DID: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (!account || !account.startsWith('0x')) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please connect your wallet to manage your DID.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.title}>DID Manager</Text>
        <Text style={styles.description}>
          Your Decentralized ID (DID) lets apps identify you securely, without central servers.
        </Text>
      </View>

      {message && (
        <View style={[
          styles.message,
          message.type === 'error' ? styles.errorMessage : styles.successMessage
        ]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Digital Key (Wallet Address)</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={account}
            editable={false}
          />
          <Text style={styles.hint}>This is your base identity in PixelLocker</Text>
        </View>

        {hasDID ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registered DID</Text>
              <View style={styles.didContainer}>
                <TextInput
                  style={[styles.input, isEditing ? styles.editableInput : styles.readOnlyInput]}
                  value={isEditing ? newDID : did}
                  onChangeText={setNewDID}
                  editable={isEditing}
                />
                {!isEditing && (
                  <View style={styles.activeBadge}>
                    <Icon name="check-circle" size={14} color="#00ffff" />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </View>
            </View>

            {!isEditing ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditing(true)}
                disabled={loading}
              >
                <Icon name="pencil" size={20} color="#0a0a0f" />
                <Text style={styles.buttonText}>Edit DID</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Updating...' : 'Update DID'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setNewDID(did);
                  }}
                  disabled={loading}
                >
                  <Icon name="close" size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Register Your DID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., did:ethr:0x1234567890abcdef..."
                placeholderTextColor="#666666"
                value={newDID}
                onChangeText={setNewDID}
              />
              <Text style={styles.hint}>Enter your Decentralized Identifier (DID)</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, (!newDID.trim() || loading) && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading || !newDID.trim()}
            >
              <Icon name="key" size={20} color="#0a0a0f" />
              <Text style={styles.buttonText}>
                {loading ? 'Registering...' : 'Register DID'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
  readOnlyInput: {
    color: '#999999',
    backgroundColor: '#1a1a2e',
  },
  editableInput: {
    borderColor: '#00ffff',
  },
  didContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeText: {
    color: '#00ffff',
    fontSize: 12,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#00ffff',
  },
  secondaryButton: {
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#444444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  errorText: {
    color: '#999999',
    textAlign: 'center',
    padding: 20,
  },
});

export default DIDManager;

