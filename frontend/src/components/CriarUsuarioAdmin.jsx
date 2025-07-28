import React, { useState } from 'react';

function CriarUsuarioAdmin() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const res = await fetch('http://localhost:3001/criar-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (data.sucesso) {
        setMensagem('Usuário admin criado com sucesso! ID: ' + data.id);
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setMensagem(data.erro || 'Erro ao criar admin');
      }
    } catch (err) {
      setMensagem('Erro ao conectar com o servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Criar Usuário Admin</h2>
      <label>
        Nome:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Senha:
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
      </label>
      <button type="submit">Criar Admin</button>
      {mensagem && <p>{mensagem}</p>}
    </form>
  );
}

export default CriarUsuarioAdmin;
