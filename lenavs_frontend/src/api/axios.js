import axios from 'axios';

// 🔥 URL do backend — com fallback para produção
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://lenavs-backend-1.onrender.com'; // <-- coloque sua URL do backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔥 Função que corrige URLs relativas (como /uploads/audio/abc.mp3)
// e transforma em URLs absolutas aceitas pelo Render
export const getFileUrl = (path) => {
  if (!path) return null;

  // Se já for URL completa, retorna
  if (path.startsWith('http')) return path;

  // Converte caminhos relativos do backend
  return `${API_URL}${path.startsWith('/') ? path : '/' + path}`;
};

// 🔥 Interceptor — adiciona token no header
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('lenavs-auth');
  if (authData) {
    const { token } = JSON.parse(authData).state;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔥 Interceptor — trata erros
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
