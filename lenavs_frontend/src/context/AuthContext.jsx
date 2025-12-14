import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trialExpired, setTrialExpired] = useState(false)

  const API_URL =
    import.meta.env.VITE_API_URL || 'https://lenavs-backend.onrender.com'

  // -----------------------------
  // CHECK USER ON APP LOAD
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem('supabase.auth.token')

    if (!token) {
      setLoading(false)
      return
    }

    checkSession(token)
  }, [])

  // -----------------------------
  // CHECK SESSION
  // -----------------------------
  const checkSession = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUser(response.data.user)
    } catch (error) {
      handleApiError(error)
      localStorage.removeItem('supabase.auth.token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // HANDLE API ERRORS
  // -----------------------------
  const handleApiError = (error) => {
    if (error?.response?.data?.code === 'TRIAL_EXPIRED') {
      setTrialExpired(true)
    }
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })

      localStorage.setItem(
        'supabase.auth.token',
        response.data.session.access_token
      )

      setUser(response.data.user)
      setTrialExpired(false)

      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        confirmPassword
      })

      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem('supabase.auth.token')
    setUser(null)
    setTrialExpired(false)
  }

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        trialExpired,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
