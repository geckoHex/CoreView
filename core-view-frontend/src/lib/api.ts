import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get('/auth');
    return response.data;
  },
};

// Core API functions
export const coreAPI = {
  health: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  echo: async (message: string) => {
    const response = await api.get('/echo', { params: { message } });
    return response.data;
  },

  reverse: async (message: string) => {
    const response = await api.get('/reverse', { params: { message } });
    return response.data;
  },

  add: async (num1: number, num2: number) => {
    const response = await api.get('/add', { params: { num1, num2 } });
    return response.data;
  },

  clock: async () => {
    const response = await api.get('/clock');
    return response.data;
  },
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
