import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
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
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VaultsScreen from './src/screens/VaultsScreen';
import PasswordsScreen from './src/screens/PasswordsScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import services
import { initializeSecurity } from './src/services/SecurityService';
import { initializeStorage } from './src/services/StorageService';
import { initializeBiometrics } from './src/services/BiometricsService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Vaults':
              iconName = 'vault';
              break;
            case 'Passwords':
              iconName = 'lock';
              break;
            case 'Security':
              iconName = 'security';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#1F2937',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: '🔐 Agies' }}
      />
      <Tab.Screen 
        name="Vaults" 
        component={VaultsScreen}
        options={{ title: '🗄️ Vaults' }}
      />
      <Tab.Screen 
        name="Passwords" 
        component={PasswordsScreen}
        options={{ title: '🔑 Passwords' }}
      />
      <Tab.Screen 
        name="Security" 
        component={SecurityScreen}
        options={{ title: '🛡️ Security' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: '⚙️ Settings' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Agies Mobile App...');
      
      // Initialize core services
      await initializeStorage();
      await initializeSecurity();
      await initializeBiometrics();
      
      // Check authentication status
      const authStatus = await checkAuthenticationStatus();
      setIsAuthenticated(authStatus);
      
      setIsInitialized(true);
      setIsLoading(false);
      
      console.log('✅ App initialization completed');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      Alert.alert('Initialization Error', 'Failed to initialize app. Please restart.');
      setIsLoading(false);
    }
  };

  const checkAuthenticationStatus = async () => {
    try {
      // Check if user has valid session
      const hasValidSession = await checkValidSession();
      return hasValidSession;
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      return false;
    }
  };

  const checkValidSession = async () => {
    // In a real implementation, this would check JWT tokens, biometrics, etc.
    // For now, return false to show login screen
    return false;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Icon name="lock" size={80} color="#6366F1" />
          <Text style={styles.loadingTitle}>Agies Password Manager</Text>
          <Text style={styles.loadingSubtitle}>Initializing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Icon name="error" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>Initialization Failed</Text>
          <Text style={styles.errorSubtitle}>Please restart the app</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
