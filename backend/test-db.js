// Teste de conexão com o banco 
const pool = require('./config/connection');

async function testar() {
  try {
    const [res] = await pool.query('SELECT NOW() AS agora');
    console.log('Conectado ao banco! Agora:', res[0].agora);
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
}
testar();
