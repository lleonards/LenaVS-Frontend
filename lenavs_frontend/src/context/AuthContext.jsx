import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL =
  import.meta.env.VITE_API_URL || 'https://lenavs-backend.onrender.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------
  // LOAD USER FROM LOCALSTORAGE
  // --------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('lenavs-auth')

    if (!stored) {
      setLoading(false)
      return
    }

    const { token } = JSON.parse(stored)
    loadUser(token)
  }, [])

  // --------------------------------------------------
  // LOAD USER FROM BACKEND
  // --------------------------------------------------
  const loadUser = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(res.data.user)
    } catch (err) {
      console.error('Sessão inválida:', err)
      localStorage.removeItem('lenavs-auth')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    })

    const { user, token } = res.data

    localStorage.setItem(
      'lenavs-auth',
      JSON.stringify({ token })
    )

    setUser(user)

    return user
  }

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------
  const register = async (name, email, password, confirmPassword) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password,
      confirmPassword,
    })

    return res.data
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const logout = () => {
    localStorage.removeItem('lenavs-auth')
    setUser(null)
  }

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

