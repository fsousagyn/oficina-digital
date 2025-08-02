const jwt = require('jsonwebtoken');
require('dotenv').config(); // para usar variáveis do .env

const chaveSecreta = process.env.JWT_SECRET || 'fallback_secreta';

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const usuario = jwt.verify(token, chaveSecreta);
    req.usuario = usuario; // adiciona os dados do usuário à requisição
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;
