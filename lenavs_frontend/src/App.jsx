import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>

        {/* ROTA INICIAL → LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROTA PROTEGIDA */}
        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          }
        />

        {/* QUALQUER OUTRA ROTA */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
