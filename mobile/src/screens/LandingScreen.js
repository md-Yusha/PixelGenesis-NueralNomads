import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { connectWallet } from '../utils/web3';
import { handleMetaMaskCallback, isMetaMaskInstalled } from '../utils/metamask';

const LandingScreen = ({ setAccount }) => {
  useEffect(() => {
    // Handle deep link when app opens
    const handleDeepLink = async (event) => {
      const { url } = event;
      if (url && url.includes('metamask')) {
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
  }, [setAccount]);

  const handleConnectMetaMask = async () => {
    try {
      const installed = await isMetaMaskInstalled();
      if (!installed) {
        Alert.alert(
          'MetaMask Not Found',
          'Please install MetaMask from the Play Store or App Store to connect.',
          [{ text: 'OK' }]
        );
        return;
      }

      const account = await connectWallet(true);
      if (account) {
        setAccount(account);
      } else {
        Alert.alert(
          'Connecting to MetaMask',
          'Please approve the connection in MetaMask. You will be redirected back to the app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      Alert.alert('Connection Error', error.message);
    }
  };

  const handleConnectLocal = async () => {
    try {
      const account = await connectWallet(false);
      setAccount(account);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PixelLocker</Text>
        <Text style={styles.subtitle}>Own Your Digital Identity</Text>
        <Text style={styles.description}>
          Securely store and share your important documents. You stay in control.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleConnectMetaMask}>
          <Text style={styles.buttonText}>Connect with MetaMask</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleConnectLocal}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Use Local Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#00ffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00ffff',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#00ffff',
  },
});

export default LandingScreen;

