// backend/routes/criarAdmin.js
const express = require('express');
const router = express.Router();
const db = require('../config/connection'); // ou '../db' conforme seu projeto
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const [resultado] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hash, 'admin']
    );

    res.json({ sucesso: true, id: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

module.exports = router;
