const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuração dinâmica do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoria = req.params.categoria;
    const imagensPath = path.join(__dirname, '../../backend/public/imagens', categoria);

    fs.mkdirSync(imagensPath, { recursive: true });
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
    fileSize: 5 * 1024 * 1024
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

// 🚀 Upload da imagem com categoria
router.post('/:categoria', upload.single('imagem'), (req, res) => {
  const categoria = req.params.categoria;

  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado ou tipo inválido' });
  }

  const urlCompleta = `${req.protocol}://${req.get('host')}/imagens/${categoria}/${req.file.filename}`;
  console.log('✅ Upload concluído:', urlCompleta);

  res.status(201).json({ imagem: urlCompleta });
});

module.exports = router;
