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
// (TOKEN CORRETO DO SUPABASE)
// ======================================================
api.interceptors.request.use(
  (config) => {
    try {
      /**
       * 🔴 IMPORTANTE:
       * O Supabase salva a sessão assim:
       * localStorage key começa com "sb-"
       */
      const supabaseSessionKey = Object.keys(localStorage).find(key =>
        key.startsWith('sb-')
      )

      if (supabaseSessionKey) {
        const sessionRaw = localStorage.getItem(supabaseSessionKey)
        const session = JSON.parse(sessionRaw)

        const token = session?.access_token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (err) {
      console.warn('Erro ao anexar token do Supabase:', err)
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
      // limpa tudo para evitar sessão quebrada
      localStorage.clear()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
