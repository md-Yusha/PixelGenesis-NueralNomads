import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import LandingScreen from './src/screens/LandingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { getCurrentAccount } from './src/utils/web3';
import { handleMetaMaskCallback } from './src/utils/metamask';

const Stack = createNativeStackNavigator();

export default function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    
    // Handle deep links
    const handleDeepLink = async (event) => {
      const { url } = event;
      if (url && (url.includes('metamask') || url.includes('pixellocker'))) {
        const account = await handleMetaMaskCallback(url);
        if (account) {
          setAccount(account);
        }
      }
    };

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const checkConnection = async () => {
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ffff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0f' },
        }}
      >
        {account ? (
          <Stack.Screen name="Dashboard">
            {(props) => <DashboardScreen {...props} account={account} setAccount={setAccount} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Landing">
            {(props) => <LandingScreen {...props} setAccount={setAccount} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
