import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  console.log('AuthContext atual:', { usuario });

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      console.log('Resposta da API:', data);

      if (data.sucesso) {
        login(data.usuario);
        console.log('Login bem-sucedido, usuário salvo no contexto:', data.usuario);
        navigate('/'); // opcional: redireciona para a página inicial
      } else {
        setErro(data.erro || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setErro('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}

export default Login;