// Ponto de entrada do servidor 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => res.send('Servidor backend está ativo!'));

app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
