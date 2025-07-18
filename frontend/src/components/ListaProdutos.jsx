import { useEffect, useState } from 'react';
import axios from 'axios';
import './painel.css';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const carregarProdutos = async () => {
    try {
      const resposta = await axios.get('/api/produtos');
      setProdutos(resposta.data);
    } catch (err) {
      setMensagem('Erro ao carregar produtos');
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await axios.delete(`/api/produtos/${id}`);
      setMensagem('Produto excluído com sucesso');
      carregarProdutos();
    } catch (err) {
      setMensagem('Erro ao excluir produto');
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div className="lista-produtos">
      <h2>Produtos Cadastrados</h2>
      {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

      <table>
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Linha</th>
            <th>Preço</th>
            <th>Promoção</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imagem_url && (
                  <img src={p.imagem_url} alt={p.nome} style={{ height: '50px' }} />
                )}
              </td>
              <td>{p.nome}</td>
              <td>{p.linha}</td>
              <td>R$ {p.preco.toFixed(2)}</td>
              <td>{p.promocao ? `R$ ${p.promocao.toFixed(2)}` : '-'}</td>
              <td>
                <button onClick={() => excluirProduto(p.id)}>Excluir</button>
                {/* Aqui futuramente podemos adicionar botão de editar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProdutos;