const jwt = require('jsonwebtoken');
const chaveSecreta = 'sua_chave_secreta_aqui'; // ideal guardar em .env

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const usuario = jwt.verify(token, chaveSecreta);
    req.usuario = usuario; // coloca dados decodificados na requisição
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;
