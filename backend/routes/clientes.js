const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/connection');

// 🔐 Cadastro de cliente
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const [existente] = await db.execute(
      'SELECT id FROM clientes WHERE email = ?',
      [email]
    );

    if (existente.length > 0) {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [resultado] = await db.execute(
      'INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      email
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

// 🔓 Login de cliente
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [clientes] = await db.execute(
      'SELECT * FROM clientes WHERE email = ?',
      [email]
    );

    if (clientes.length === 0) {
      return res.status(401).json({ erro: 'Cliente não encontrado' });
    }

    const cliente = clientes[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Em breve: gerar token JWT aqui, se quiser autenticação completa 👀
    res.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao autenticar cliente' });
  }
});

module.exports = router;
