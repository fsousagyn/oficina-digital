const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // se quiser usar senha criptografada
const clientesRouter = require('./routes/clientes');
const app = express();
const orcamentosRouter = require('./routes/orcamentos');
const produtosRouter = require('./routes/produtosRoutes');
const uploadRouter = require('./routes/uploadRoutes');
app.use(cors());
app.use(express.json());
app.use('/api/clientes', clientesRouter);
app.use('/api/orcamentos', orcamentosRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/upload', uploadRouter);
console.log('Iniciando servidor...');
// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ef@2025*IA',
  database: 'oficina_digital'
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const usuario = results[0];
    if (senha === usuario.senha) {
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: 'Senha incorreta' });
    }
  });
});
   app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});