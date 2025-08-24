import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  securityLevel: {
    id: string;
    name: string;
    description: string;
    encryptionStrength: number;
    mazeDepth: number;
    honeypotCount: number;
    trapComplexity: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Use Vite environment variables with proper fallbacks
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';
  const APP_NAME = import.meta.env.VITE_APP_NAME || 'Padhma Vyuham Security Vault';
  const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
  const IS_DEV = import.meta.env.DEV || false;
  const MODE = import.meta.env.MODE || 'development';

  useEffect(() => {
    if (token) {
      // Validate token and get user info
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/security/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Token is valid, user is authenticated
        // In a real app, you'd fetch user details here
        setUser({
          id: 'user-id',
          email: 'user@example.com',
          username: 'User',
          securityLevel: {
            id: 'standard',
            name: 'Standard Security',
            description: 'Standard encryption and protection',
            encryptionStrength: 8,
            mazeDepth: 6,
            honeypotCount: 4,
            trapComplexity: 7
          }
        });
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      // Auto-login after successful registration
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Log environment info in development mode
  useEffect(() => {
    if (IS_DEV) {
      console.log('AuthContext Environment Info:', {
        API_BASE,
        APP_NAME,
        APP_VERSION,
        MODE,
        IS_DEV
      });
    }
  }, [API_BASE, APP_NAME, APP_VERSION, MODE, IS_DEV]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
