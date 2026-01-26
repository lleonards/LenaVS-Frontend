import axios from 'axios';

// ======================================================
// 🔗 URL DO BACKEND (Render)
// ======================================================
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://lenavs-backend.onrender.com';

// ======================================================
// 🚀 INSTÂNCIA AXIOS
// ❗ NÃO definir Content-Type globalmente
// ======================================================
const api = axios.create({
  baseURL: API_URL
});

// ======================================================
// 📁 CONVERTER PATHS DO BACKEND EM URL COMPLETA
// ======================================================
export const getFileUrl = (path) => {
  if (!path) return null;

  if (path.startsWith('http')) return path;

  return `${API_URL}${path.startsWith('/') ? path : '/' + path}`;
};

// ======================================================
// 🔐 INTERCEPTOR DE REQUEST
// (Adiciona token do Supabase automaticamente)
// ======================================================
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('lenavs-auth');

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed?.session?.access_token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Erro ao ler token:', err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// 🚫 INTERCEPTOR DE RESPONSE
// (Logout automático se token expirar)
// ======================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lenavs-auth');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
