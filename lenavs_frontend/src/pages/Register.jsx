import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../api/services';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
      } else {
        setError('Preencha todos os campos');
      }
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      // 🔐 Salva usuário + sessão (Supabase)
      setAuth(response.data.user, response.data.session);

      navigate('/editor');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

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
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !isFormValid()}
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
  );
}

export default Register;
