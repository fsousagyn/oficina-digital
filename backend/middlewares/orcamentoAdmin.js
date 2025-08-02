const express = require('express');
const router = express.Router();
const db = require('../config/connection');
const verificarAdmin = require('../middlewares/verificarAdmin');
const validarAtualizacaoOrcamento = require('../middlewares/validarAtualizacaoOrcamento');

// 📄 Listar orçamentos com filtro opcional por status
router.get('/admin/orcamentos', verificarAdmin, async (req, res) => {
  const { status } = req.query;
  const query = status
    ? 'SELECT * FROM orcamentos WHERE status = ?'
    : 'SELECT * FROM orcamentos';
  const params = status ? [status] : [];

  try {
    const [rows] = await db.execute(query, params);

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
        dados: dadosConvertidos,
        status: o.status,
        data_criacao: o.data_criacao,
        valor_estimado: o.valor_estimado
      };
    });

    res.json(orcamentos);
  } catch (erro) {
    console.error('Erro ao buscar orçamentos (admin):', erro);
    res.status(500).json({ erro: 'Erro ao buscar orçamentos' });
  }
});

// ✏️ Atualizar orçamento (status e valor estimado)
router.put('/admin/orcamentos/:id', verificarAdmin, validarAtualizacaoOrcamento, async (req, res) => {
  const { status, valor_estimado } = req.body;

  try {
    await db.execute(
      'UPDATE orcamentos SET status = ?, valor_estimado = ? WHERE id = ?',
      [status, valor_estimado, req.params.id]
    );
    res.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao atualizar orçamento (admin):', erro);
    res.status(500).json({ erro: 'Erro ao atualizar orçamento' });
  }
});

module.exports = router;
