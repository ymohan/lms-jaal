import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, GraduationCap, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SecurityUtils } from '../../utils/security';

interface LoginFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export function LoginForm({ onSuccess, onBack }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, csrfToken, error, clearError } = useAuth();
  const { t } = useLanguage();

  // Clear auth context error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Reset form error when inputs change
  useEffect(() => {
    if (formError) {
      setFormError('');
    }
  }, [email, password, role]);

  // Show auth context error in form
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = async () => {
    // Check if user is blocked due to too many attempts
    if (isBlocked) {
      setFormError('Too many failed attempts. Please try again later.');
      return;
    }

    // Validate input
    if (!email || !password || !role) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!SecurityUtils.validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Check rate limiting
    if (!SecurityUtils.checkRateLimit(email, 'login')) {
      setFormError('Too many login attempts. Please try again in 15 minutes.');
      setIsBlocked(true);
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      const success = await login(email, password, role);
      if (!success) {
        setAttempts(prev => prev + 1);
        
        // Block after 5 failed attempts
        if (attempts >= 4) {
          setIsBlocked(true);
          setFormError('Account temporarily locked due to multiple failed attempts');
        }
      } else {
        setAttempts(0);
        setIsBlocked(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setFormError('Login failed. Please try again.');
      SecurityUtils.logSecurityEvent({
        action: 'login_error',
        resource: 'auth',
        success: false,
        details: { error: err },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </button>
        )}
        
        <div>
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('welcome')} to LinguaLearn
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Accelerated Second Language Learning Platform
          </p>
          
          {/* Security Notice */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-xs text-blue-800 dark:text-blue-300">
                Secure login with advanced protection
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          {/* Error Messages */}
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                <div className="text-sm text-red-600 dark:text-red-300">{formError}</div>
              </div>
            </div>
          )}

          {/* Rate Limiting Warning */}
          {attempts > 2 && !isBlocked && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Warning: {5 - attempts} attempts remaining before account lock
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <div><strong>Admin:</strong> admin@lms.com</div>
              <div><strong>Teacher:</strong> teacher@lms.com</div>
              <div><strong>Student:</strong> student@lms.com</div>
              <div><strong>Password:</strong> password (for all)</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('selectRole')} *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                disabled={isLoading || isBlocked}
              >
                <option value="">{t('selectRole')}</option>
                <option value="admin">{t('admin')}</option>
                <option value="teacher">{t('teacher')}</option>
                <option value="student">{t('student')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                placeholder="Enter your email"
                disabled={isLoading || isBlocked}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')} *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                  placeholder="Enter your password"
                  disabled={isLoading || isBlocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading || isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CSRF Token (hidden) */}
          <input type="hidden" value={csrfToken} />

          <button
            onClick={handleSubmit}
            disabled={isLoading || isBlocked}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('loading')}
              </div>
            ) : (
              t('login')
            )}
          </button>

          {/* Security Features */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>🔒 SSL Encrypted Connection</div>
              <div>🛡️ CSRF Protection Enabled</div>
              <div>⚡ Rate Limiting Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}