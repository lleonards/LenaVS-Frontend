import axios from 'axios'

// ======================================================
// 🔗 URL DO BACKEND
// ======================================================
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://lenavs-backend-1.onrender.com'

// ======================================================
// 🚀 INSTÂNCIA AXIOS
// ======================================================
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false
})

// ======================================================
// 📁 CONVERTER PATH DO BACKEND EM URL
// ======================================================
export const getFileUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_URL}${path.startsWith('/') ? path : '/' + path}`
}

// ======================================================
// 🔐 REQUEST INTERCEPTOR
// ======================================================
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('lenavs-auth')

    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        const token = parsed?.session?.access_token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {}
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ======================================================
// 🚫 RESPONSE INTERCEPTOR
// ======================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lenavs-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
