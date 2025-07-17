import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaProtegida;