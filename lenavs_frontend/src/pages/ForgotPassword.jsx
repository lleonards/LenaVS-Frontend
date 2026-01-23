import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import './Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Informe seu email')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setMessage(
        'Se esse email existir, enviamos um link para redefinir sua senha.'
      )
    } catch (err) {
      console.error(err)
      setError('Erro ao enviar email de recuperação')
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

        <h1 className="auth-title">Esqueci minha senha</h1>

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

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
