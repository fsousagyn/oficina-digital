import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useCliente } from '../context/ClienteContext';
import { FaHome, FaShoppingCart, FaUserLock, FaClipboardList } from 'react-icons/fa';
import { useState, useEffect } from 'react';

function Header() {
  const { usuario, logout } = useAuth();
  const { cliente, logoutCliente } = useCliente();
  const nomeExibido = usuario?.nome || cliente?.nome;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      const dropdown = document.getElementById('dropdown-como-comprar');
      if (dropdown && !dropdown.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

        {/* Dropdown Como Comprar com clique */}
        <div className="dropdown" id="dropdown-como-comprar">
          <button
            className={`nav-link dropdown-toggle ${isDropdownOpen ? 'ativo' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaShoppingCart className="nav-icon" />
            Como Comprar ▾
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <a
                href="https://loja.infinitepay.io/efcriativa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Produto Padrão
              </a>
              <Link to="/como-comprar?modo=personalizar">Personalizar</Link>
              <Link to="/como-comprar?modo=novo">Novo Projeto</Link>
            </div>
          )}
        </div>

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
