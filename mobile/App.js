import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme as RNDarkTheme } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

const CustomDarkTheme = {
  ...RNDarkTheme,
  colors: {
    ...RNDarkTheme.colors,
    primary: '#e94560',
    background: '#0f0e17',
    card: '#1a1a2e',
    text: '#ccd6f6',
    border: '#16213e',
    notification: '#e94560',
  },
};

function RootNavigation() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0e17' }}>
      <NavigationContainer theme={CustomDarkTheme}>
        {token ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0e17',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
