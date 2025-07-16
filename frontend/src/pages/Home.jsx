import { useState } from 'react';
import './Home.css';

function Home() {
  const [imagens, setImagens] = useState([
    '/imagens/projeto1.jpg',
    '/imagens/projeto2.jpg',
    '/imagens/projeto3.jpg',
  ]);
  const [indexAtual, setIndexAtual] = useState(0);

  // Simulação de login administrativo
  const isLoggedIn = false;

  const avancar = () => {
    if (imagens.length === 0) return;
    setIndexAtual((prev) => (prev + 1) % imagens.length);
  };

  const voltar = () => {
    if (imagens.length === 0) return;
    setIndexAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const adicionarImagem = () => {
    const file = document.getElementById('nova-imagem').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      setImagens((prev) => [...prev, event.target.result]);
      setIndexAtual(prev => prev + 1);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="tela">
      <h2>Bem-vindo à EF Criativa</h2>

      {/* Carrossel */}
      <div className="carrossel">
        <button className="carrossel-btn" onClick={voltar}>❮</button>
        <div className="carrossel-imagens">
          <img src={imagens[indexAtual]} alt={`Foto ${indexAtual + 1}`} />
        </div>
        <button className="carrossel-btn" onClick={avancar}>❯</button>
      </div>

      {/* Upload de imagem (somente se logado) */}
      {isLoggedIn && (
        <div className="upload-carrossel">
          <label htmlFor="nova-imagem">Adicionar nova imagem ao carrossel:</label>
          <input type="file" id="nova-imagem" accept="image/*" />
          <button onClick={adicionarImagem}>Adicionar</button>
        </div>
      )}

      {/* Vídeo institucional */}
      <div className="video-institucional">
        <h3>Conheça nossa história</h3>
        <video controls>
          <source src="/video/institucional.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      </div>
    </section>
  );
}

export default Home;