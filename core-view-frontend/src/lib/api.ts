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

// File Manager API functions
export const fileAPI = {
  listFiles: async (path: string, showHidden: boolean = false) => {
    const response = await api.get('/files/list', { 
      params: { path, show_hidden: showHidden } 
    });
    return response.data;
  },

  searchFiles: async (path: string, pattern: string, showHidden: boolean = false) => {
    const response = await api.get('/files/search', { 
      params: { path, pattern, show_hidden: showHidden } 
    });
    return response.data;
  },

  getFileInfo: async (path: string) => {
    const response = await api.get('/files/info', { params: { path } });
    return response.data;
  },

  readFile: async (path: string) => {
    const response = await api.get('/files/read', { params: { path } });
    return response.data;
  },

  createFile: async (path: string, content: string = '') => {
    const response = await api.post('/files/create', { path, content });
    return response.data;
  },

  createDirectory: async (path: string) => {
    const response = await api.post('/files/mkdir', { path });
    return response.data;
  },

  moveItem: async (source: string, destination: string) => {
    const response = await api.post('/files/move', { source, destination });
    return response.data;
  },

  deleteItem: async (path: string) => {
    const response = await api.delete('/files/delete', { data: { path } });
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
