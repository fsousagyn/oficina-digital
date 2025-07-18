import { useState } from 'react';
import CadastroProduto from './CadastroProduto';
import ListaProdutos from './ListaProdutos';
import OrcamentosAdmin from '../pages/OrcamentosAdmin';
// Futuramente: import Relatorios from './Relatorios';
import './painel.css';

function PainelAdmin() {
  const [tela, setTela] = useState('inicio');

  const renderConteudo = () => {
    switch (tela) {
      case 'cadastro':
        return <CadastroProduto />;
      case 'lista':
        return <ListaProdutos />;
      case 'orcamentos':
        return <OrcamentosAdmin />;
      case 'relatorios':
        return <p>Em breve: tela de relatórios</p>;
      default:
        return (
          <div className="painel-inicio">
            <h2>Bem-vindo ao Painel Administrativo</h2>
            <p>Escolha uma opção no menu acima para começar.</p>
          </div>
        );
    }
  };

  return (
    <div className="painel-admin">
      <header className="painel-header">
        <h1>EF Criativa – Painel Admin</h1>
        <nav>
          <button onClick={() => setTela('inicio')}>Início</button>
          <button onClick={() => setTela('cadastro')}>Cadastrar Produto</button>
          <button onClick={() => setTela('lista')}>Listar Produtos</button>
          <button onClick={() => setTela('orcamentos')}>Orçamentos</button>
          <button onClick={() => setTela('relatorios')}>Relatórios</button>
        </nav>
      </header>

      <main className="painel-conteudo">
        {renderConteudo()}
      </main>
    </div>
  );
}

export default PainelAdmin;