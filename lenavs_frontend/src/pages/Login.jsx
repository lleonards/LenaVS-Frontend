import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../api/services'
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
      const response = await authService.login({
        email,
        password
      })

      const { user, session } = response.data || {}

      // ✅ VALIDAÇÃO FORTE
      if (!user || !session || !session.access_token) {
        throw new Error('Sessão inválida')
      }

      // ✅ SALVA AUTH
      setAuth(user, session)

      // ✅ REDIRECIONA SOMENTE SE TUDO DEU CERTO
      navigate('/editor', { replace: true })
    } catch (err) {
      console.error('Erro login:', err)

      // ❌ NÃO REDIRECIONA
      setError(
        err.response?.data?.message ||
        'Email ou senha inválidos'
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
              autoComplete="email"
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
              autoComplete="current-password"
            />
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
