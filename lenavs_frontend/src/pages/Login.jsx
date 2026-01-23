import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { useAuthStore } from '../store/authStore'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data?.user || !data?.session) {
        throw new Error('Sessão inválida')
      }

      setAuth(data.user, data.session)
      navigate('/editor', { replace: true })

    } catch (err) {
      console.error('LOGIN ERROR:', err)

      const message = err.message?.toLowerCase() || ''
      setError(
        message.includes('invalid')
          ? 'Email ou senha inválidos'
          : 'Erro ao fazer login'
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

        <h1 className="auth-title">Login</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* ESQUECI A SENHA */}
          <div className="auth-forgot">
            <Link to="/forgot-password" className="auth-link">
              Esqueci minha senha
            </Link>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          Não tem uma conta?{' '}
          <Link to="/register" className="auth-link">
            Registre-se
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
