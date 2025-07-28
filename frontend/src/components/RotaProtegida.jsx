import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children, tipoPermitido }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (tipoPermitido && usuario.tipo !== tipoPermitido) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}

export default RotaProtegida;
