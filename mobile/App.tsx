// 🛡️ Agies Password Manager - Mobile App
// Advanced React Native app with biometric security and offline-first architecture

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchID from 'react-native-touch-id';
import Keychain from 'react-native-keychain';

// Import screens
import AuthScreen from './src/screens/AuthScreen';
import VaultScreen from './src/screens/VaultScreen';
import PasswordListScreen from './src/screens/PasswordListScreen';
import PasswordDetailScreen from './src/screens/PasswordDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import BiometricSetupScreen from './src/screens/BiometricSetupScreen';

// Import services
import { AuthService } from './src/services/AuthService';
import { VaultService } from './src/services/VaultService';
import { BiometricService } from './src/services/BiometricService';
import { SyncService } from './src/services/SyncService';
import { SecurityService } from './src/services/SecurityService';

// Import context providers
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { VaultProvider } from './src/context/VaultContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import components
import LoadingScreen from './src/components/LoadingScreen';
import OfflineIndicator from './src/components/OfflineIndicator';
import SecurityOverlay from './src/components/SecurityOverlay';

// Navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
function TabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Vaults"
        component={VaultScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🗄️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Passwords"
        component={PasswordListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔐</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🛡️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
    </Stack.Navigator>
  );
}

// Main Stack Navigator
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="PasswordDetail" 
        component={PasswordDetailScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// App Content Component
function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showSecurityOverlay, setShowSecurityOverlay] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Network connectivity monitoring
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // App state change handling for security
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setShowSecurityOverlay(true);
      } else if (nextAppState === 'active') {
        // Require biometric authentication when returning
        if (isAuthenticated) {
          authenticateWithBiometrics();
        } else {
          setShowSecurityOverlay(false);
        }
      }
    };

    return () => {
      // Cleanup listeners
    };
  }, [isAuthenticated]);

  const initializeApp = async () => {
    try {
      // Check device security
      await SecurityService.checkDeviceSecurity();
      
      // Initialize services
      await AuthService.initialize();
      await VaultService.initialize();
      await SyncService.initialize();
      
      // Check for stored biometric preference
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      if (biometricEnabled === 'true') {
        await BiometricService.initialize();
      }
      
      // App is ready
      setIsAppReady(true);
      SplashScreen.hide();
      
    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to initialize the app. Please restart.',
        [{ text: 'OK' }]
      );
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      if (biometricEnabled === 'true') {
        const result = await BiometricService.authenticate();
        if (result.success) {
          setShowSecurityOverlay(false);
        } else {
          // Failed biometric auth - require master password
          Alert.alert(
            'Authentication Required',
            'Please enter your master password to continue',
            [
              {
                text: 'Authenticate',
                onPress: () => {
                  // Navigate to auth screen or show master password prompt
                  AuthService.logout();
                },
              },
            ]
          );
        }
      } else {
        setShowSecurityOverlay(false);
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setShowSecurityOverlay(false);
    }
  };

  if (!isAppReady || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Offline Indicator */}
      {!isConnected && <OfflineIndicator />}
      
      {/* Security Overlay */}
      {showSecurityOverlay && (
        <SecurityOverlay onAuthenticate={authenticateWithBiometrics} />
      )}
      
      {/* Main Navigation */}
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <VaultProvider>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.container}
            >
              <AppContent />
            </LinearGradient>
          </VaultProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// App Configuration
export const AppConfig = {
  name: 'Agies Password Manager',
  version: '1.0.0',
  buildNumber: 1,
  apiUrl: 'https://agies-password-manager.onrender.com',
  features: {
    biometricAuth: true,
    offlineMode: true,
    autoSync: true,
    darkMode: true,
    exportImport: true,
    sharing: true,
    backup: true,
    security: {
      chakravyuhamEngine: true,
      aiGuardian: true,
      honeypots: true,
      darkWebMonitoring: true,
    },
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 300000, // 5 minutes
    sessionTimeout: 900000, // 15 minutes
    biometricTimeout: 30000, // 30 seconds
    encryptionAlgorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2',
    iterations: 100000,
  },
};
