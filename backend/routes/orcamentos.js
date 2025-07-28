const express = require('express');
const router = express.Router();
const db = require('../config/connection');

// 💾 Salvar orçamento
router.post('/', async (req, res) => {
  const { cliente_email, tipo_solicitacao, mensagem, dados } = req.body;

  // 🔍 Validação básica
  if (
    !cliente_email ||
    !tipo_solicitacao ||
    !dados ||
    Object.prototype.toString.call(dados) !== '[object Object]'
  ) {
    return res.status(400).json({ erro: 'Dados incompletos ou inválidos' });
  }

  try {
    const dadosFormatados = JSON.stringify(dados);

    const [resultado] = await db.execute(
      'INSERT INTO orcamentos (cliente_email, tipo_solicitacao, mensagem, dados) VALUES (?, ?, ?, ?)',
      [cliente_email, tipo_solicitacao, mensagem || '', dadosFormatados]
    );

    res.status(201).json({
      sucesso: true,
      id: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao salvar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao salvar orçamento' });
  }
});

// 📄 Listar orçamentos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM orcamentos');

    const orcamentos = rows.map((o) => {
      let dadosConvertidos = {};
      try {
        dadosConvertidos =
          typeof o.dados === 'string' ? JSON.parse(o.dados) : o.dados;
      } catch (err) {
        console.warn(`Erro ao converter JSON do orçamento ${o.id}:`, o.dados);
      }

      return {
        id: o.id,
        cliente_email: o.cliente_email,
        tipo_solicitacao: o.tipo_solicitacao,
        mensagem: o.mensagem,
        dados: dadosConvertidos
      };
    });

    res.json(orcamentos);
  } catch (erro) {
    console.error('Erro ao buscar orçamentos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar orçamentos' });
  }
});

module.exports = router;
