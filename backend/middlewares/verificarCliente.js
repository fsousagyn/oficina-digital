function verificarCliente(req, res, next) {
  if (req.usuario?.tipo !== 'cliente') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para clientes' });
  }
  next();
}

module.exports = verificarCliente;
