import axios from 'axios';
import { io } from 'socket.io-client';

// Create axios instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Socket.IO connection
export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await api.post('/users/login', { email, password, role });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/users/register', { name, email, password, role });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    return response.data;
  }
};

// Course API
export const courseAPI = {
  getAllCourses: async (params?: any) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },
  getCourseById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  createCourse: async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
  updateCourse: async (id: string, courseData: any) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
  getCoursesByTeacher: async (teacherId?: string) => {
    const url = teacherId ? `/courses/teacher/${teacherId}` : '/courses/teacher';
    const response = await api.get(url);
    return response.data;
  },
  getEnrolledCourses: async (studentId?: string) => {
    const url = studentId ? `/courses/student/${studentId}` : '/courses/student';
    const response = await api.get(url);
    return response.data;
  },
  addLesson: async (courseId: string, lessonData: any) => {
    const response = await api.post(`/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },
  updateLesson: async (courseId: string, lessonId: string, lessonData: any) => {
    const response = await api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  },
  deleteLesson: async (courseId: string, lessonId: string) => {
    const response = await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  }
};

// Quiz API
export const quizAPI = {
  getQuizById: async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  createQuiz: async (quizData: any) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  updateQuiz: async (id: string, quizData: any) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },
  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
  submitQuiz: async (id: string, answers: any) => {
    const response = await api.post(`/quizzes/${id}/submit`, { answers });
    return response.data;
  }
};

// Completion API
export const completionAPI = {
  getUserCompletions: async (userId?: string) => {
    const url = userId ? `/completions/${userId}` : '/completions';
    const response = await api.get(url);
    return response.data;
  },
  getCourseCompletion: async (courseId: string, userId?: string) => {
    const url = userId 
      ? `/completions/course/${courseId}/${userId}` 
      : `/completions/course/${courseId}`;
    const response = await api.get(url);
    return response.data;
  },
  updateCompletion: async (data: any) => {
    const response = await api.post('/completions', data);
    return response.data;
  },
  getCourseCompletionStats: async (courseId: string) => {
    const response = await api.get(`/completions/stats/${courseId}`);
    return response.data;
  }
};

// Enrollment API
export const enrollmentAPI = {
  enrollInCourse: async (courseId: string) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },
  unenrollFromCourse: async (courseId: string) => {
    const response = await api.delete(`/enrollments/${courseId}`);
    return response.data;
  },
  getUserEnrollments: async (userId?: string) => {
    const url = userId ? `/enrollments/${userId}` : '/enrollments';
    const response = await api.get(url);
    return response.data;
  },
  getCourseEnrollments: async (courseId: string) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },
  issueCertificate: async (data: any) => {
    const response = await api.post('/enrollments/certificate', data);
    return response.data;
  },
  verifyCertificate: async (verificationCode: string) => {
    const response = await api.get(`/enrollments/certificate/verify/${verificationCode}`);
    return response.data;
  },
  getUserCertificates: async (userId?: string) => {
    const url = userId ? `/enrollments/certificate/${userId}` : '/enrollments/certificate';
    const response = await api.get(url);
    return response.data;
  }
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getSecurityLogs: async (params?: any) => {
    const response = await api.get('/users/logs', { params });
    return response.data;
  }
};

export default api;