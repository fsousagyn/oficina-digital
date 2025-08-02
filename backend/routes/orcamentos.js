const express = require('express');
const router = express.Router();
const db = require('../config/connection');
const multer = require('multer');
const path = require('path');

// 🗂️ Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 📄 Enviar orçamento com imagem
router.post('/orcamentos', upload.single('imagem'), async (req, res) => {
  const {
    cliente_email,
    tipo_solicitacao,
    produto_id,
    tipo_personalizacao,
    mensagem,
    dados
  } = req.body;

  const imagem_referencia = req.file ? req.file.filename : null;

  try {
    const [result] = await db.execute(
      'INSERT INTO orcamentos (cliente_email, tipo_solicitacao, produto_id, tipo_personalizacao, mensagem, dados, imagem_referencia, status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        cliente_email,
        tipo_solicitacao,
        produto_id || null,
        tipo_personalizacao || null,
        mensagem,
        JSON.stringify(dados),
        imagem_referencia,
        'pendente'
      ]
    );

    res.json({ sucesso: true, id: result.insertId });
  } catch (erro) {
    console.error('Erro ao enviar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao enviar orçamento' });
  }
});

// 📄 Cadastrar produtos padrão (usados para personalização)
router.post('/produtos', async (req, res) => {
  const { nome, descricao, valor, imagem } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO produtos (nome, descricao, valor, imagem) VALUES (?, ?, ?, ?)',
      [nome, descricao, valor, imagem]
    );

    res.json({ sucesso: true, id: result.insertId });
  } catch (erro) {
    console.error('Erro ao cadastrar produto:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

// 📄 Listar produtos padrão (para exibir no frontend)
router.get('/produtos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM produtos');
    res.json(rows);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

// 📄 Redirecionar para loja virtual após login
router.get('/redirecionar-loja', (req, res) => {
  res.redirect('https://loja.infinitepay.io/efcriativa');
});

module.exports = router;
