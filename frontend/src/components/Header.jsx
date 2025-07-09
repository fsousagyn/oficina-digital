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
            <h1>EF CrIAtiva</h1>
            <span>MarcenarIA & SerralherIA </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="nav">
  <Link to="/quem-somos">Quem Somos</Link>
  <Link to="/clientes">Clientes</Link>
  <Link to="/contato">Contato</Link>
  <Link to="/como-comprar">Como Comprar</Link>
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
