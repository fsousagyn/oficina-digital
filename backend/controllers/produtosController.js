const db = require('../config/connection');

// ✅ Listar
async function listarProdutos(req, res) {
  try {
    const [produtos] = await db.execute('SELECT * FROM produtos');
    res.json(produtos);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
}

// 📦 Cadastro
async function cadastrarProduto(req, res) {
  const { nome, descricao, preco } = req.body;
  const imagem = req.file ? `/imagens/${req.file.filename}` : '';

  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  }

  try {
    const [resultado] = await db.execute(
      'INSERT INTO produtos (nome, descricao, preco, imagem_url) VALUES (?, ?, ?, ?)',
      [nome, descricao || '', preco, imagem]
    );

    res.status(201).json({
      sucesso: true,
      id: resultado.insertId,
      nome,
      preco,
      imagem
    });
  } catch (erro) {
    console.error('Erro ao cadastrar produto:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
}

// ✏️ Atualizar (inclusive imagem)
async function atualizarProduto(req, res) {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;
  const imagem = req.file ? `/imagens/${req.file.filename}` : req.body.imagem_url || '';

  if (!id || !nome || !preco) {
    return res.status(400).json({ erro: 'Dados obrigatórios ausentes' });
  }

  try {
    await db.execute(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem_url = ? WHERE id = ?',
      [nome, descricao || '', preco, imagem, id]
    );

    res.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
}

// 🗑️ Excluir
async function excluirProduto(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID do produto é obrigatório' });
  }

  try {
    await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
    res.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
}

module.exports = {
  listarProdutos,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
};
