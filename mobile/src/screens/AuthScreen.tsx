// 🔐 Agies Authentication Screen
// Beautiful, secure authentication with biometric support

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BiometricService } from '../services/BiometricService';
import { SecurityService } from '../services/SecurityService';
import LoadingSpinner from '../components/LoadingSpinner';
import HapticFeedback from '../utils/HapticFeedback';

const { width, height } = Dimensions.get('window');

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthScreen: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const { theme } = useTheme();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  
  // Animations
  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const biometricOpacity = useSharedValue(0);
  
  // Form handling
  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<AuthFormData>();

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    // Animate logo and form entrance
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    formOpacity.value = withTiming(1, { duration: 800 });
    
    if (biometricAvailable) {
      biometricOpacity.value = withTiming(1, { duration: 1000 });
    }
  }, [biometricAvailable]);

  const initializeScreen = async () => {
    try {
      // Check for biometric availability
      const biometricCheck = await BiometricService.checkAvailability();
      setBiometricAvailable(biometricCheck.available);
      setBiometricType(biometricCheck.type);
      
      // Check if user has previously enabled biometrics
      const storedBiometric = await AsyncStorage.getItem('biometric_enabled');
      if (storedBiometric === 'true' && biometricCheck.available) {
        // Auto-trigger biometric authentication
        setTimeout(() => {
          handleBiometricAuth();
        }, 1000);
      }
    } catch (error) {
      console.error('Biometric initialization error:', error);
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [
        {
          translateY: interpolate(formOpacity.value, [0, 1], [50, 0]),
        },
      ],
    };
  });

  const biometricAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: biometricOpacity.value,
      transform: [
        {
          scale: interpolate(biometricOpacity.value, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  const handleBiometricAuth = async () => {
    try {
      HapticFeedback.light();
      const result = await BiometricService.authenticate();
      
      if (result.success) {
        HapticFeedback.success();
        // Retrieve stored credentials and auto-login
        const credentials = await BiometricService.getStoredCredentials();
        if (credentials) {
          await login(credentials.email, credentials.password);
        }
      } else {
        HapticFeedback.error();
        Alert.alert(
          'Authentication Failed',
          result.error || 'Biometric authentication failed',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      HapticFeedback.error();
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    try {
      Keyboard.dismiss();
      HapticFeedback.light();

      if (isLoginMode) {
        const result = await login(data.email, data.password);
        if (result.success) {
          HapticFeedback.success();
          
          // Offer to enable biometric authentication
          if (biometricAvailable) {
            Alert.alert(
              'Enable Biometric Authentication?',
              `Would you like to use ${biometricType} for faster access?`,
              [
                { text: 'Not Now', style: 'cancel' },
                {
                  text: 'Enable',
                  onPress: () => enableBiometricAuth(data.email, data.password),
                },
              ]
            );
          }
        } else {
          HapticFeedback.error();
          Alert.alert('Login Failed', result.error || 'Invalid credentials');
        }
      } else {
        if (data.password !== data.confirmPassword) {
          HapticFeedback.error();
          Alert.alert('Error', 'Passwords do not match');
          return;
        }

        const result = await register(data.email, data.password);
        if (result.success) {
          HapticFeedback.success();
          Alert.alert(
            'Account Created',
            'Your account has been created successfully!',
            [{ text: 'OK', onPress: () => setIsLoginMode(true) }]
          );
        } else {
          HapticFeedback.error();
          Alert.alert('Registration Failed', result.error || 'Failed to create account');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      HapticFeedback.error();
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const enableBiometricAuth = async (email: string, password: string) => {
    try {
      const result = await BiometricService.enableBiometricAuth(email, password);
      if (result.success) {
        await AsyncStorage.setItem('biometric_enabled', 'true');
        HapticFeedback.success();
        Alert.alert(
          'Biometric Authentication Enabled',
          `${biometricType} has been enabled for your account.`
        );
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
    }
  };

  const toggleAuthMode = () => {
    HapticFeedback.light();
    setIsLoginMode(!isLoginMode);
    reset();
    setShowPassword(false);
  };

  const getBiometricIcon = () => {
    switch (biometricType.toLowerCase()) {
      case 'faceid':
        return '🤳';
      case 'touchid':
      case 'fingerprint':
        return '👆';
      default:
        return '🔐';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo Section */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoIcon}>🛡️</Text>
              </View>
              <Text style={styles.logoText}>Agies</Text>
              <Text style={styles.logoSubtext}>Chakravyuham Security</Text>
            </Animated.View>

            {/* Form Section */}
            <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text style={styles.formSubtitle}>
                  {isLoginMode 
                    ? 'Sign in to access your secure vault'
                    : 'Join the most secure password manager'
                  }
                </Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>📧</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.email && styles.inputError,
                          ]}
                          placeholder="Enter your email"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Master Password</Text>
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔑</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            errors.password && styles.inputError,
                          ]}
                          placeholder="Enter your master password"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Text style={styles.eyeIcon}>
                            {showPassword ? '👁️' : '🙈'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                  )}
                </View>

                {/* Confirm Password (Register Mode) */}
                {!isLoginMode && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <Controller
                      control={control}
                      name="confirmPassword"
                      rules={{
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === getValues('password') || 'Passwords do not match',
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                          <Text style={styles.inputIcon}>🔒</Text>
                          <TextInput
                            style={[
                              styles.textInput,
                              errors.confirmPassword && styles.inputError,
                            ]}
                            placeholder="Confirm your password"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </View>
                      )}
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.submitGradient}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" color="white" />
                    ) : (
                      <Text style={styles.submitText}>
                        {isLoginMode ? 'Sign In' : 'Create Account'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Toggle Auth Mode */}
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleAuthMode}
                >
                  <Text style={styles.toggleText}>
                    {isLoginMode
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Biometric Authentication */}
            {biometricAvailable && isLoginMode && (
              <Animated.View style={[styles.biometricContainer, biometricAnimatedStyle]}>
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricAuth}
                >
                  <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text>
                  <Text style={styles.biometricText}>
                    Use {biometricType}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    fontSize: 20,
    marginLeft: 16,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1a202c',
  },
  eyeButton: {
    padding: 15,
  },
  eyeIcon: {
    fontSize: 18,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  submitGradient: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  biometricContainer: {
    alignItems: 'center',
  },
  biometricButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 160,
  },
  biometricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  biometricText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});

export default AuthScreen;
