import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { disconnectWallet } from '../utils/web3';
import { formatAddress } from '../utils/helpers';
import { determineUserRole } from '../utils/roles';
import HomeTab from '../components/dashboard/HomeTab';
import MyDocuments from '../components/dashboard/MyDocuments';
import UploadDocuments from '../components/dashboard/UploadDocuments';
import DIDManager from '../components/dashboard/DIDManager';
import ShareCredentials from '../components/dashboard/ShareCredentials';
import ScanDocument from '../components/dashboard/ScanDocument';
import IssuerDashboard from '../components/dashboard/IssuerDashboard';
import IssueDocument from '../components/dashboard/IssueDocument';
import OwnerDashboard from '../components/dashboard/OwnerDashboard';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardScreen = ({ account, setAccount }) => {
  const [userRole, setUserRole] = useState('user');
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, [account]);

  const loadUserRole = async () => {
    if (!account) {
      setLoadingRole(false);
      return;
    }

    setLoadingRole(true);
    try {
      const role = await determineUserRole(account);
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('user');
    } finally {
      setLoadingRole(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setAccount(null);
  };

  // Create tab navigator based on role
  const createTabNavigator = () => {
    if (userRole === 'owner') {
      return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#00ffff',
            tabBarInactiveTintColor: '#666666',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Owner"
            component={() => <OwnerDashboard account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="shield" size={24} color={color || '#00ffff'} />,
            }}
          />
        </Tab.Navigator>
      );
    } else if (userRole === 'issuer') {
      return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#00ffff',
            tabBarInactiveTintColor: '#666666',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={() => <HomeTab account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Issuer"
            component={() => <IssuerDashboard account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="shield" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Issue"
            component={() => <IssueDocument account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="upload" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Scan"
            component={() => <ScanDocument account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="qrcode-scan" size={24} color={color || '#00ffff'} />,
            }}
          />
        </Tab.Navigator>
      );
    } else if (userRole === 'verifier') {
      return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#00ffff',
            tabBarInactiveTintColor: '#666666',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={() => <HomeTab account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Scan"
            component={() => <ScanDocument account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="qrcode-scan" size={24} color={color || '#00ffff'} />,
            }}
          />
        </Tab.Navigator>
      );
    } else {
      // User role
      return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#00ffff',
            tabBarInactiveTintColor: '#666666',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={() => <HomeTab account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Documents"
            component={() => <MyDocuments account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="file-document" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Upload"
            component={() => <UploadDocuments account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="upload" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="DID"
            component={() => <DIDManager account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="key" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Share"
            component={() => <ShareCredentials account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="share" size={24} color={color || '#00ffff'} />,
            }}
          />
          <Tab.Screen
            name="Scan"
            component={() => <ScanDocument account={account} />}
            options={{
              tabBarIcon: ({ color }) => <Icon name="qrcode-scan" size={24} color={color || '#00ffff'} />,
            }}
          />
        </Tab.Navigator>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PixelLocker</Text>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Connected as</Text>
            <Text style={styles.accountAddress}>{formatAddress(account)}</Text>
            {!loadingRole && (
              <Text style={styles.roleText}>
                Role: <Text style={styles.roleValue}>{userRole}</Text>
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Icon name="logout" size={20} color="#ffffff" />
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigator */}
      {createTabNavigator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffff',
    fontFamily: 'monospace',
  },
  accountInfo: {
    flex: 1,
    marginLeft: 16,
  },
  accountLabel: {
    fontSize: 12,
    color: '#999999',
  },
  accountAddress: {
    fontSize: 14,
    color: '#00ffff',
    fontFamily: 'monospace',
  },
  roleText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  roleValue: {
    color: '#9966ff',
    textTransform: 'capitalize',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disconnectText: {
    color: '#ffffff',
    fontSize: 12,
  },
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopColor: 'rgba(0, 255, 255, 0.2)',
    borderTopWidth: 1,
  },
});

export default DashboardScreen;

