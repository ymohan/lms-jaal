import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { SecurityUtils } from '../utils/security';
import { authAPI } from '../api';
import { socket } from '../api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  csrfToken: string;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Generate CSRF token
    setCsrfToken(SecurityUtils.generateCSRFToken());
    
    // Check for stored token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Verify token with backend
        authAPI.getCurrentUser()
          .then(response => {
            setUser(response.user);
            SecurityUtils.logSecurityEvent({
              userId: response.user._id,
              action: 'session_restored',
              resource: 'auth',
              success: true,
            });
          })
          .catch(error => {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            SecurityUtils.logSecurityEvent({
              action: 'invalid_session',
              resource: 'auth',
              success: false,
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(email, 'login')) {
      SecurityUtils.logSecurityEvent({
        action: 'login_rate_limited',
        resource: 'auth',
        success: false,
        details: { email, role },
      });
      return false;
    }

    // Validate input
    if (!SecurityUtils.validateEmail(email)) {
      SecurityUtils.logSecurityEvent({
        action: 'login_invalid_email',
        resource: 'auth',
        success: false,
        details: { email },
      });
      return false;
    }

    try {
      const response = await authAPI.login(email, password, role);
      
      if (response.success) {
        const { token, user } = response;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update socket auth
        socket.auth = { token };
        socket.connect();
        
        setUser(user);
        
        SecurityUtils.logSecurityEvent({
          userId: user._id,
          action: 'login_success',
          resource: 'auth',
          success: true,
          details: { email, role },
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      SecurityUtils.logSecurityEvent({
        action: 'login_failed',
        resource: 'auth',
        success: false,
        details: { email, role, error: error.message },
      });
      
      return false;
    }
  };

  const logout = () => {
    if (user) {
      SecurityUtils.logSecurityEvent({
        userId: user.id,
        action: 'logout',
        resource: 'auth',
        success: true,
      });
    }
    
    // Disconnect socket
    socket.disconnect();
    
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setCsrfToken(SecurityUtils.generateCSRFToken());
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await authAPI.updateProfile(updates);
        
        if (response.success) {
          const updatedUser = response.user;
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          SecurityUtils.logSecurityEvent({
            userId: user.id,
            action: 'user_updated',
            resource: 'user',
            success: true,
            details: Object.keys(updates),
          });
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Update user error:', error);
        return false;
      }
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      csrfToken,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}