import axios from 'axios';
import { io } from 'socket.io-client';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for CORS requests if needed
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
      window.location.href = '/';
    }
    
    // Return the error with a more user-friendly message
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    error.userMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

// Socket.IO connection
export const socket = io(API_BASE_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

// Socket connection event handlers
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    try {
      const response = await api.post('/users/login', { email, password, role });
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

  updateProfile: async (updates: any) => {
    try {
      const response = await api.put('/users/profile', updates);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change password API error:', error);
      throw error;
    }
  },
  
  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Request password reset API error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/users/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password API error:', error);
      throw error;
    }
  },
};

// Course API
export const courseAPI = {
  getAllCourses: async (filters = {}) => {
    try {
      const response = await api.get('/courses', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get courses API error:', error);
      throw error;
    }
  },

  getCourse: async (id: string) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get course API error:', error);
      throw error;
    }
  },

  createCourse: async (courseData: any) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Create course API error:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: any) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Update course API error:', error);
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete course API error:', error);
      throw error;
    }
  },
};

// Quiz API
export const quizAPI = {
  getQuizzes: async () => {
    try {
      const response = await api.get('/quizzes');
      return response.data;
    } catch (error) {
      console.error('Get quizzes API error:', error);
      throw error;
    }
  },

  getQuiz: async (id: string) => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get quiz API error:', error);
      throw error;
    }
  },

  createQuiz: async (quizData: any) => {
    try {
      const response = await api.post('/quizzes', quizData);
      return response.data;
    } catch (error) {
      console.error('Create quiz API error:', error);
      throw error;
    }
  },

  updateQuiz: async (id: string, quizData: any) => {
    try {
      const response = await api.put(`/quizzes/${id}`, quizData);
      return response.data;
    } catch (error) {
      console.error('Update quiz API error:', error);
      throw error;
    }
  },

  deleteQuiz: async (id: string) => {
    try {
      const response = await api.delete(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete quiz API error:', error);
      throw error;
    }
  },

  submitQuiz: async (quizId: string, answers: any) => {
    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
      return response.data;
    } catch (error) {
      console.error('Submit quiz API error:', error);
      throw error;
    }
  },
};

// Enrollment API
export const enrollmentAPI = {
  getEnrollments: async () => {
    try {
      const response = await api.get('/enrollments');
      return response.data;
    } catch (error) {
      console.error('Get enrollments API error:', error);
      throw error;
    }
  },

  enroll: async (courseId: string) => {
    try {
      const response = await api.post('/enrollments', { courseId });
      return response.data;
    } catch (error) {
      console.error('Enroll API error:', error);
      throw error;
    }
  },

  unenroll: async (courseId: string) => {
    try {
      const response = await api.delete(`/enrollments/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Unenroll API error:', error);
      throw error;
    }
  },
  
  getCertificates: async () => {
    try {
      const response = await api.get('/enrollments/certificate');
      return response.data;
    } catch (error) {
      console.error('Get certificates API error:', error);
      throw error;
    }
  },
  
  verifyCertificate: async (code: string) => {
    try {
      const response = await api.get(`/enrollments/certificate/verify/${code}`);
      return response.data;
    } catch (error) {
      console.error('Verify certificate API error:', error);
      throw error;
    }
  },
};

// Completion API
export const completionAPI = {
  getCompletions: async () => {
    try {
      const response = await api.get('/completions');
      return response.data;
    } catch (error) {
      console.error('Get completions API error:', error);
      throw error;
    }
  },

  updateCompletion: async (data: { courseId: string, lessonId?: string, progress?: number, score?: number }) => {
    try {
      const response = await api.post('/completions', data);
      return response.data;
    } catch (error) {
      console.error('Update completion API error:', error);
      throw error;
    }
  },
  
  getCourseCompletion: async (courseId: string) => {
    try {
      const response = await api.get(`/completions/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get course completion API error:', error);
      throw error;
    }
  },
  
  getCourseStats: async (courseId: string) => {
    try {
      const response = await api.get(`/completions/stats/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get course stats API error:', error);
      throw error;
    }
  },
};

export default api;