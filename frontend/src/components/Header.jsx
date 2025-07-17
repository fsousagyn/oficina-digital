import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { usuario } = useAuth(); // ✅ hook dentro da função
  console.log('Usuário no Header:', usuario);
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
        <Link to="/login" className="nav-link">Login</Link>
      </nav>

      {usuario && (
        <div className="usuario-logado">
          Olá, <strong>{usuario.nome}</strong>
        </div>
      )}
    </header>
  );
}

export default Header;