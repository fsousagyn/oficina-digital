module.exports = (req, res, next) => {
  const { status, valor_estimado } = req.body;

  if (!status || typeof valor_estimado !== 'number') {
    return res.status(400).json({ erro: 'Dados inválidos para atualização de orçamento' });
  }

  next();
};
