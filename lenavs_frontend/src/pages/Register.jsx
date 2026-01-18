import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { useAuthStore } from '../store/authStore'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      // 🔐 CRIA USUÁRIO NO SUPABASE AUTH
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // metadata
          },
        },
      })

      if (error) {
        throw error
      }

      if (!data?.user) {
        throw new Error('Erro ao criar usuário')
      }

      // ⚠️ Se email confirmation estiver ATIVO
      if (!data.session) {
        navigate('/login')
        return
      }

      // ✅ SALVA NO ZUSTAND
      setAuth(data.user, data.session)

      // ✅ REDIRECIONA
      navigate('/editor', { replace: true })
    } catch (err) {
      console.error('REGISTER ERROR:', err)

      setError(
        err.message === 'User already registered'
          ? 'Este email já está cadastrado'
          : 'Erro ao criar conta'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <img src="/logo.png" alt="LenaVS" />
        </div>

        <h1 className="auth-title">Criar Conta</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="auth-footer">
          Já tem uma conta?{' '}
          <Link to="/login" className="auth-link">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
