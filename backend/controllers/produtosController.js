const connection = require('../config/connection');

const listarProdutos = async (req, res) => {
  const { linha } = req.query;
  try {
    const query = linha
      ? 'SELECT * FROM produtos WHERE ativo = true AND linha = ? ORDER BY nome'
      : 'SELECT * FROM produtos WHERE ativo = true ORDER BY nome';
    const params = linha ? [linha] : [];
    const [rows] = await connection.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

const cadastrarProduto = async (req, res) => {
  const { nome, linha, preco, promocao, descricao, imagem_url, ativo } = req.body;
  try {
    const query = `
      INSERT INTO produtos (nome, linha, preco, promocao, descricao, imagem_url, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [nome, linha, preco, promocao, descricao, imagem_url, ativo ?? true];
    const [result] = await connection.query(query, params);
    const [novoProduto] = await connection.query('SELECT * FROM produtos WHERE id = ?', [result.insertId]);
    res.status(201).json(novoProduto[0]);
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
};

const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, linha, preco, promocao, descricao, imagem_url, ativo } = req.body;
  try {
    const query = `
      UPDATE produtos SET nome = ?, linha = ?, preco = ?, promocao = ?, descricao = ?, imagem_url = ?, ativo = ?
      WHERE id = ?
    `;
    const params = [nome, linha, preco, promocao, descricao, imagem_url, ativo, id];
    await connection.query(query, params);
    const [produtoAtualizado] = await connection.query('SELECT * FROM produtos WHERE id = ?', [id]);
    res.json(produtoAtualizado[0]);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await connection.query('DELETE FROM produtos WHERE id = ?', [id]);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
};

module.exports = {
  listarProdutos,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
};