import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo-area">
        <img src="/imagens/logo-ef.png" alt="Logo EF Criativa" />
          <div>
            <h1>EF CrIAtiva</h1>
            <span>MarcenarIA & SerralherIA </span>
            </div>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/como-comprar" className="nav-link">Como Comprar</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </nav>
    </header>
  );
}

export default Header;
