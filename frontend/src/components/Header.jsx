import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        {/* Logo + Nome */}
        <div className="logo">
          <img src="/imagens/logo-ef.png" alt="Logo EF Criativa" />
          <div>
            <h1>EF Madeira e Metal</h1>
            <span>MarcenarIA & SerralherIA CrIAtiva</span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="nav">
          <a href="#quem-somos">Quem Somos</a>
          <a href="#clientes">Clientes</a>
          <a href="#contato">Contato</a>
          <a href="#como-comprar">Como Comprar</a>
        </nav>

        {/* Botão Acessar */}
        <div className="acesso">
          <Link to="/login">
            <button>Entrar</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
