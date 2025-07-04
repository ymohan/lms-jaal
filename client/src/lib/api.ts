import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return the error with a more user-friendly message
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    error.userMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user API error:', error);
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get all users API error:', error);
      throw error;
    }
  },
  
  updateProfile: async (updates: any) => {
    try {
      const response = await api.put('/users/profile', updates);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },
};

export default api;