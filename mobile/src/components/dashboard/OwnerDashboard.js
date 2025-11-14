import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const OwnerDashboard = ({ account }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="shield" size={64} color="#00ffff" />
        <Text style={styles.title}>Owner Dashboard</Text>
        <Text style={styles.subtitle}>Contract Owner Access</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Owner Privileges</Text>
        <View style={styles.privilegeList}>
          <View style={styles.privilegeItem}>
            <Icon name="check-circle" size={20} color="#00ffff" />
            <Text style={styles.privilegeText}>Manage Issuers</Text>
          </View>
          <View style={styles.privilegeItem}>
            <Icon name="check-circle" size={20} color="#00ffff" />
            <Text style={styles.privilegeText}>Manage Verifiers</Text>
          </View>
          <View style={styles.privilegeItem}>
            <Icon name="check-circle" size={20} color="#00ffff" />
            <Text style={styles.privilegeText}>Full System Control</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Information</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Owner Address</Text>
          <Text style={styles.infoValue}>{account}</Text>
        </View>
        <Text style={styles.note}>
          As the contract owner, you have administrative privileges to manage the system.
          Use the web interface for full administrative features.
        </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ffff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  privilegeList: {
  },
  privilegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privilegeText: {
    fontSize: 14,
    color: '#cccccc',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#00ffff',
    fontFamily: 'monospace',
  },
  note: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginTop: 8,
  },
});

export default OwnerDashboard;

