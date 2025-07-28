import React from 'react';
import { Link } from 'react-router-dom';

function AcessoNegado() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/login">Voltar para o Login</Link>
    </div>
  );
}

export default AcessoNegado;
