const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const clientesRouter = require('./routes/clientes');
const orcamentosRouter = require('./routes/orcamentos');
const produtosRouter = require('./routes/produtosRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas
app.use('/api/clientes', clientesRouter);
app.use('/api/orcamentos', orcamentosRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/upload', uploadRouter);

console.log('🚀 Iniciando servidor...');

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ef@2025*IA',
  database: 'oficina_digital'
});

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.params.tipo;
    const dir = path.join(__dirname, 'public', 'imagens', tipo);

    // Garante que o diretório exista
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  }
});
const upload = multer({ storage });

// Upload por categoria
app.post('/upload/:tipo', upload.single('imagem'), (req, res) => {
  try {
    const tipo = req.params.tipo;

    if (!req.file) {
      console.warn('❌ Nenhum arquivo enviado');
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    const url = `/imagens/${tipo}/${req.file.filename}`;
    console.log('✅ Upload concluído:', url);

    res.json({ url });
  } catch (error) {
    console.error('💥 Erro no upload:', error);
    res.status(500).json({ erro: 'Erro no servidor ao processar o upload' });
  }
});

// Exclusão de imagem
app.delete('/delete/:tipo/:filename', (req, res) => {
  const { tipo, filename } = req.params;
  const filePath = path.join(__dirname, 'public', 'imagens', tipo, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Erro ao excluir:', err);
      return res.status(500).json({ erro: 'Erro ao excluir o arquivo' });
    }
    res.json({ sucesso: true, mensagem: 'Arquivo excluído com sucesso' });
  });
});

// Login com verificação segura
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const usuario = results[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (senhaValida) {
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: 'Senha incorreta' });
    }
  });
});

app.listen(3001, () => {
  console.log('✅ Servidor rodando na porta 3001');
});
