import { useState } from 'react';
import axios from 'axios';
import './painel.css';

function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [linha, setLinha] = useState('');
  const [preco, setPreco] = useState('');
  const [promocao, setPromocao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [imagemUrl, setImagemUrl] = useState('');
  const [mensagem, setMensagem] = useState('');

  const linhasDisponiveis = ['pet', 'residencial', 'comercial', 'decoracao', 'utilidades'];

  const handleUploadImagem = async () => {
    if (!imagem) return;

    const formData = new FormData();
    formData.append('imagem', imagem);

    try {
      const resposta = await axios.post('/api/upload', formData);
      setImagemUrl(resposta.data.imagem);
    } catch (err) {
      setMensagem('Erro ao enviar imagem');
    }
  };

  const handleSalvarProduto = async () => {
    if (!nome || !linha || !preco) {
      setMensagem('Preencha os campos obrigatórios');
      return;
    }

    try {
      await axios.post('/api/produtos', {
        nome,
        linha,
        preco: parseFloat(preco),
        promocao: promocao ? parseFloat(promocao) : null,
        descricao,
        imagem_url: imagemUrl,
        ativo: true
      });
      setMensagem('Produto cadastrado com sucesso!');
      // Limpar campos
      setNome('');
      setLinha('');
      setPreco('');
      setPromocao('');
      setDescricao('');
      setImagem(null);
      setImagemUrl('');
    } catch (err) {
      setMensagem('Erro ao salvar produto');
    }
  };

  return (
    <div className="cadastro-produto">
      <h2>Cadastrar Novo Produto</h2>

      <label>Nome do produto *</label>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

      <label>Linha *</label>
      <select value={linha} onChange={(e) => setLinha(e.target.value)}>
        <option value="">Selecione</option>
        {linhasDisponiveis.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <label>Preço (R$) *</label>
      <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />

      <label>Preço promocional (opcional)</label>
      <input type="number" value={promocao} onChange={(e) => setPromocao(e.target.value)} />

      <label>Descrição</label>
      <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

      <label>Imagem do produto</label>
      <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
      <button type="button" onClick={handleUploadImagem}>Enviar imagem</button>

      {imagemUrl && (
        <div>
          <p>Imagem salva:</p>
          <img src={imagemUrl} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}

      <button type="button" onClick={handleSalvarProduto}>Salvar Produto</button>

      {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
    </div>
  );
}

export default CadastroProduto;