const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📂 Caminho da pasta de imagens
const imagensPath = path.join(__dirname, '../../frontend/public/imagens');
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

// 🧰 Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagensPath),
  filename: (req, file, cb) => {
    const nomeBase = path.basename(file.originalname, path.extname(file.originalname));
    const nomeFinal = `${nomeBase}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, nomeFinal);
  }
});
const upload = multer({ storage });

// 📦 Cadastro com imagem
router.post('/', upload.single('imagem'), produtosController.cadastrarProduto);

// ✏️ Atualização com nova imagem
router.put('/:id', upload.single('imagem'), produtosController.atualizarProduto);

router.get('/', produtosController.listarProdutos);
router.delete('/:id', produtosController.excluirProduto);

module.exports = router;
