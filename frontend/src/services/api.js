import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('empowerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('empowerToken');
      localStorage.removeItem('empowerUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('empowerToken', response.data.token);
      localStorage.setItem('empowerUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('empowerToken');
    localStorage.removeItem('empowerUser');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('empowerUser');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const pointsService = {
  getMyPoints: async () => {
    const response = await api.get('/points/me');
    return response.data;
  },

  getPointsByEmail: async (email) => {
    const response = await api.get(`/points/user/${email}`);
    return response.data;
  },
};

export default api;
