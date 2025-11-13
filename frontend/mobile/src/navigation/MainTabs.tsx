import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HolderHomeScreen } from '../screens/Holder/HolderHomeScreen';
import { MyCredentialsScreen } from '../screens/Holder/MyCredentialsScreen';
import { VerifyCredentialScreen } from '../screens/Verifier/VerifyCredentialScreen';
import { Text } from 'react-native';

export type MainTabsParamList = {
  Home: undefined;
  Credentials: undefined;
  Verify: { prefillJson?: string; prefillHash?: string } | undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HolderHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Credentials"
        component={MyCredentialsScreen}
        options={{
          title: 'Credentials',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📜</Text>,
        }}
      />
      <Tab.Screen
        name="Verify"
        component={VerifyCredentialScreen}
        options={{
          title: 'Verify',
          tabBarIcon: ({ color }) => <Text style={{ color }}>✓</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

