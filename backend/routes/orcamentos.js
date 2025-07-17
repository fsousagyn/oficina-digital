const express = require('express');
const router = express.Router();
const db = require('../config/connection');

router.post('/', async (req, res) => {
  const { cliente_email, tipo_solicitacao, mensagem, dados } = req.body;

  try {
    await db.execute(
      'INSERT INTO orcamentos (cliente_email, tipo_solicitacao, mensagem, dados) VALUES (?, ?, ?, ?)',
      [cliente_email, tipo_solicitacao, mensagem, JSON.stringify(dados)]
    );
    res.status(201).json({ sucesso: true });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao salvar orçamento' });
  }
});

module.exports = router;