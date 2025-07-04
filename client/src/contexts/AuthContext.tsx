import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      setError(error.userMessage || 'Login failed');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      setError(error.userMessage || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};