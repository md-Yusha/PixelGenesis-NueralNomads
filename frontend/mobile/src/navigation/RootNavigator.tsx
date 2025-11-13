import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../lib/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { CredentialDetailScreen } from '../screens/Holder/CredentialDetailScreen';
import { ScanQrScreen } from '../screens/Verifier/ScanQrScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CredentialDetail: { credentialId: string };
  ScanQr: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CredentialDetail"
              component={CredentialDetailScreen}
              options={{ title: 'Credential Details' }}
            />
            <Stack.Screen
              name="ScanQr"
              component={ScanQrScreen}
              options={{ title: 'Scan QR Code' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

