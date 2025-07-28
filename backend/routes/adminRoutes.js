const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/connection');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.get('/admin/dashboard', verificarToken, verificarAdmin, (req, res) => {
  res.json({ mensagem: 'Bem-vindo ao painel do administrador!' });
});


// 👨‍💼 Login de admin com token
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [admins] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ erro: 'Admin não encontrado' });
    }

    const admin = admins[0];
    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: admin.id, tipo: 'admin', email: admin.email },
      process.env.JWT_SEGREDO,
      { expiresIn: '2h' }
    );

    res.json({
      nome: admin.nome,
      email: admin.email,
      token
    });
  } catch (erro) {
    console.error('Erro ao autenticar admin:', erro);
    res.status(500).json({ erro: 'Erro ao autenticar admin' });
  }
});

module.exports = router;
