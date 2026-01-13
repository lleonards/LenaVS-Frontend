import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Ainda verificando sessão
  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>
        Carregando...
      </div>
    )
  }

  // Não autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Autenticado
  return children
}
