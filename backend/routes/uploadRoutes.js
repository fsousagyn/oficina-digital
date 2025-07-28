const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 📁 Caminho absoluto para salvar imagens
const imagensPath = path.join(__dirname, '../../frontend/public/imagens');

// 🧱 Garante que a pasta existe
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

// 🎯 Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagensPath);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    const nomeBase = path.basename(file.originalname, extensao);
    const timestamp = Date.now();
    const nomeFinal = `${nomeBase}-${timestamp}${extensao}`;
    cb(null, nomeFinal);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 🛡️ Limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

// 🚀 Upload da imagem
router.post('/', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado ou tipo inválido' });
  }

  const caminhoRelativo = `/imagens/${req.file.filename}`;
  res.status(201).json({ imagem: caminhoRelativo });
});

module.exports = router;
