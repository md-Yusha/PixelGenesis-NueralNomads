import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '../config';

const METAMASK_DEEP_LINK = 'metamask://wc';
const METAMASK_PACKAGE = 'io.metamask';

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = async () => {
  if (Platform.OS === 'android') {
    try {
      const url = `intent://wc#Intent;scheme=metamask;package=${METAMASK_PACKAGE};end`;
      const canOpen = await Linking.canOpenURL(url);
      return canOpen;
    } catch (error) {
      return false;
    }
  }
  // For iOS, we'll try to open and catch error
  return true;
};

/**
 * Connect to MetaMask using deep linking
 */
export const connectMetaMask = async () => {
  try {
    // Create a connection request
    const connectionUrl = `https://metamask.app.link/dapp?url=${encodeURIComponent(
      Linking.createURL('/')
    )}`;
    
    if (Platform.OS === 'android') {
      // Try to open MetaMask directly
      const metamaskUrl = `metamask://wc?uri=${encodeURIComponent(connectionUrl)}`;
      const canOpen = await Linking.canOpenURL(metamaskUrl);
      
      if (canOpen) {
        await Linking.openURL(metamaskUrl);
      } else {
        // Fallback to web
        await Linking.openURL(connectionUrl);
      }
    } else {
      // iOS
      await Linking.openURL(connectionUrl);
    }
    
    // Store that we're waiting for MetaMask connection
    await AsyncStorage.setItem('waiting_for_metamask', 'true');
    
    return null; // Will be set via deep link callback
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw new Error('Failed to open MetaMask. Please make sure MetaMask is installed.');
  }
};

/**
 * Handle deep link from MetaMask
 */
export const handleMetaMaskCallback = async (url) => {
  try {
    const parsed = Linking.parse(url);
    console.log('MetaMask callback URL:', url);
    console.log('Parsed params:', parsed.queryParams);
    
    // Extract account from callback - MetaMask may pass it in different formats
    let account = null;
    
    // Try different parameter names
    if (parsed.queryParams?.accounts) {
      const accounts = Array.isArray(parsed.queryParams.accounts) 
        ? parsed.queryParams.accounts 
        : [parsed.queryParams.accounts];
      account = accounts[0];
    } else if (parsed.queryParams?.account) {
      account = parsed.queryParams.account;
    } else if (parsed.queryParams?.address) {
      account = parsed.queryParams.address;
    } else if (parsed.queryParams?.wallet) {
      account = parsed.queryParams.wallet;
    }
    
    // Also check if account is in the URL path
    if (!account && parsed.path) {
      const pathMatch = parsed.path.match(/0x[a-fA-F0-9]{40}/);
      if (pathMatch) {
        account = pathMatch[0];
      }
    }
    
    if (account && account.startsWith('0x')) {
      await AsyncStorage.setItem('wallet_address', account);
      await AsyncStorage.setItem('wallet_type', 'metamask');
      await AsyncStorage.removeItem('waiting_for_metamask');
      return account;
    }
    
    // If callback=true but no account, MetaMask might be asking for approval
    if (parsed.queryParams?.callback === 'true') {
      console.log('Waiting for MetaMask approval...');
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error handling MetaMask callback:', error);
    return null;
  }
};

/**
 * Get MetaMask provider (for read operations)
 */
export const getMetaMaskProvider = () => {
  // For mobile, we'll use JSON RPC provider
  // MetaMask mobile doesn't expose a direct provider
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
};

/**
 * Sign a transaction with MetaMask
 */
export const signWithMetaMask = async (transaction) => {
  // This would require WalletConnect or similar SDK
  // For now, we'll use a simplified approach
  throw new Error('MetaMask signing not yet implemented. Please use the web app for transactions.');
};

