import { useEffect, useState } from 'react';
import axios from 'axios';
import PersonalizacaoCard from '../components/PersonalizacaoCard';
import './orcamentos.css';

function OrcamentosAdmin() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  useEffect(() => {
    const carregarOrcamentos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/orcamentos');
        setOrcamentos(res.data);
      } catch (err) {
        console.error('Erro ao carregar orçamentos:', err);
      }
    };
    carregarOrcamentos();
  }, []);

  const filtrarOrcamentos = () => {
    if (filtro === 'todos') return orcamentos;
    return orcamentos.filter((o) => o.tipo === filtro);
  };

  return (
    <div className="orcamentos-admin">
      <h2>Orçamentos Recebidos</h2>

      {!orcamentoSelecionado && (
        <div className="filtros">
          <button onClick={() => setFiltro('todos')}>Todos</button>
          <button onClick={() => setFiltro('padrao')}>Produto Padrão</button>
          <button onClick={() => setFiltro('personalizar')}>Padrão + Personalização</button>
          <button onClick={() => setFiltro('novo')}>Novo Projeto</button>
        </div>
      )}

      {orcamentoSelecionado ? (
        <PersonalizacaoCard
          dados={orcamentoSelecionado}
          onVoltar={() => setOrcamentoSelecionado(null)}
        />
      ) : (
        <div className="lista-orcamentos">
          {filtrarOrcamentos().map((o) => (
            <div key={o.id} className="orcamento-card">
              <h3>{o.nome}</h3>
              <p><strong>Contato:</strong> {o.contato}</p>
              <p><strong>Tipo:</strong> {o.tipo}</p>

              {o.tipo === 'padrao' && (
                <>
                  <p><strong>Produto:</strong> {o.produto}</p>
                  <button>Confirmar pagamento</button>
                  <button>Enviar produto</button>
                </>
              )}

              {o.tipo === 'personalizar' && (
                <button onClick={() => setOrcamentoSelecionado(o)}>Abrir orçamento</button>
              )}

              {o.tipo === 'novo' && (
                <>
                  <p><strong>Projeto:</strong> {o.tipo_projeto}</p>
                  <button>Ver detalhes</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrcamentosAdmin;