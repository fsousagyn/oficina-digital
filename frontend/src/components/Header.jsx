import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useCliente } from '../context/ClienteContext';

function Header() {
  const { usuario, logout } = useAuth();
  const { cliente, logoutCliente } = useCliente();

  return (
    <header className="header">
      <div className="logo-area">
        <img src="/imagens/logo-ef.png" alt="Logo EF Criativa" />
        <div>
          <h1>EF CrIAtiva</h1>
          <span>MarcenarIA & SerralherIA</span>
        </div>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/como-comprar" className="nav-link">Como Comprar</Link>
        {!usuario && !cliente && (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </nav>

      {(usuario || cliente) && (
        <div className="usuario-logado">
          Olá, <strong>{usuario?.nome || cliente?.nome}</strong>
          <button
            className="btn-sair"
            onClick={usuario ? logout : logoutCliente}
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;