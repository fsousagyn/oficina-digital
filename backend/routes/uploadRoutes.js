const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Caminho absoluto para a pasta de imagens
const imagensPath = path.join(__dirname, '../../frontend/public/imagens');

// Garante que a pasta existe
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagensPath);
  },
  filename: (req, file, cb) => {
    const nomeOriginal = file.originalname;
    const extensao = path.extname(nomeOriginal);
    const nomeBase = path.basename(nomeOriginal, extensao);
    const timestamp = Date.now();
    const nomeFinal = `${nomeBase}-${timestamp}${extensao}`;
    cb(null, nomeFinal);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  }

  const caminhoRelativo = `/imagens/${req.file.filename}`;
  res.json({ imagem: caminhoRelativo });
});

module.exports = router;