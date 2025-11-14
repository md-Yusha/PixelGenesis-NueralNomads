import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getDIDRegistryContractReadOnly } from '../../utils/web3';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const HomeTab = ({ account }) => {
  const [did, setDid] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDID();
  }, [account]);

  const loadDID = async () => {
    if (!account) {
      setLoading(false);
      return;
    }
    try {
      const contract = getDIDRegistryContractReadOnly();
      const hasRegistered = await contract.hasDID(account);
      if (hasRegistered) {
        const registeredDID = await contract.getDID(account);
        setDid(registeredDID);
      }
    } catch (error) {
      console.log('No DID registered yet');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'educational',
      title: 'Educational Documents',
      icon: 'school',
      color: '#00ffff',
      description: 'Degrees, certificates, transcripts',
    },
    {
      id: 'employment',
      title: 'Employee Related Documents',
      icon: 'briefcase',
      color: '#9966ff',
      description: 'Employment letters, contracts, IDs',
    },
    {
      id: 'medical',
      title: 'Medical Documents',
      icon: 'heart',
      color: '#00ffff',
      description: 'Health records, prescriptions, reports',
    },
    {
      id: 'confidential',
      title: 'Confidential Documents',
      icon: 'lock',
      color: '#9966ff',
      description: 'Private documents, sensitive data',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Your Digital Key:</Text>
          <Text style={styles.infoValue}>{account}</Text>
        </View>
        {!loading && did && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Your DID:</Text>
            <Text style={styles.infoValue}>{did}</Text>
          </View>
        )}
        {!loading && !did && (
          <Text style={styles.infoText}>
            You haven't registered a DID yet. Go to DID Manager to register one.
          </Text>
        )}
      </View>

      {/* Document Categories */}
      <Text style={styles.sectionTitle}>Your Document Categories</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <Icon name={category.icon} size={32} color={category.color} />
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
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
  welcomeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#00ffff',
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});

export default HomeTab;

