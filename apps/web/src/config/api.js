import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';

    // Don't redirect on login/register/verify endpoints
    const isAuthEndpoint = url.includes('/auth/login') || 
                           url.includes('/auth/register') || 
                           url.includes('/auth/verify-email');

    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const suspended = status === 403 && message.toLowerCase().includes('suspendida');

    if ((status === 401 && !isAuthEndpoint) || suspended) {
      if (suspended) {
        sessionStorage.setItem(
          'flashMessage',
          message || 'Tu cuenta está suspendida. Contactá a soporte.'
        );
      }
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
