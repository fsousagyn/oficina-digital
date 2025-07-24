import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useCliente } from '../context/ClienteContext';
import { FaHome, FaShoppingCart, FaUserLock, FaClipboardList } from 'react-icons/fa';

function Header() {
  const { usuario, logout } = useAuth();
  const { cliente, logoutCliente } = useCliente();

  const nomeExibido = usuario?.nome || cliente?.nome;

  return (
    <header className="header-ef">
      <div className="logo-area">
        <img
          src="/imagens/logo-ef.png"
          alt="Logo EF Criativa"
          className="logo-img"
        />
        <div className="titulo-container">
          <h1>
            EF Cr<span className="destaque-ia">IA</span>tiva
          </h1>
          <span className="subtitulo">
            Marcenar<span className="destaque-ia1">IA</span> e Serralher
            <span className="destaque-ia1">IA</span>
          </span>
        </div>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-link">
          <FaHome className="nav-icon" />
          Início
        </Link>
        <Link to="/como-comprar" className="nav-link">
          <FaShoppingCart className="nav-icon" />
          Como Comprar
        </Link>
        {usuario && (
          <Link to="/admin" className="nav-link">
            <FaClipboardList className="nav-icon" />
            Painel
          </Link>
        )}
        {!usuario && !cliente && (
          <Link to="/login" className="nav-link">
            <FaUserLock className="nav-icon" />
            Login
          </Link>
        )}
      </nav>

      {(usuario || cliente) && (
        <div className="usuario-logado">
          Olá, <strong>{nomeExibido}</strong>
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