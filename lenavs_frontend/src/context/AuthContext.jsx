import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

const API_URL =
  import.meta.env.VITE_API_URL || 'https://lenavs-backend.onrender.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trialExpired, setTrialExpired] = useState(false)

  // --------------------------------------------------
  // CHECK SESSION ON APP LOAD
  // --------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('lenavs-auth')

    if (!stored) {
      setLoading(false)
      return
    }

    const { token } = JSON.parse(stored)
    verifySession(token)
  }, [])

  // --------------------------------------------------
  // VERIFY SESSION (BACKEND)
  // --------------------------------------------------
  const verifySession = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser({
        id: res.data.userId,
      })
    } catch (err) {
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

    const token = res.data.session.access_token

    localStorage.setItem(
      'lenavs-auth',
      JSON.stringify({
        token,
        userId: res.data.user.id,
      })
    )

    setUser(res.data.user)
    setTrialExpired(false)

    return res.data
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
    setTrialExpired(false)
  }

  // --------------------------------------------------
  // CONTEXT
  // --------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        trialExpired,
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
