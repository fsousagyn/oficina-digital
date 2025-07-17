import { useState } from 'react';
import './Home.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { usuario } = useAuth(); // ✅ verifica login
  const [imagens, setImagens] = useState([
    '/imagens/projeto1.jpg',
    '/imagens/projeto2.jpg',
    '/imagens/projeto3.jpg',
  ]);
  const [indexAtual, setIndexAtual] = useState(0);

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
      setIndexAtual((prev) => prev + 1);
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
      {usuario && (
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

      {/* Quem Somos */}
      <div className="quem-somos">
        <h3>Quem Somos</h3>
        <p>
          A EF Criativa nasceu da paixão por transformar ideias em soluções reais. Com foco em design funcional e acabamento artesanal, oferecemos produtos personalizados para ambientes residenciais, comerciais e pet.
        </p>
      </div>

      {/* Parceiros */}
      <div className="parceiros">
        <h3>Parceiros</h3>
        <div className="parceiros-grupo">
          <div className="parceiros-cliente">
            <h4>Clientes</h4>
            <div className="logos">
              <img src="/imagens/cliente1.png" alt="Cliente 1" />
              <img src="/imagens/cliente2.jpeg" alt="Cliente 2" />
              <img src="/imagens/cliente2.png" alt="Cliente 2" />
            </div>
          </div>
          <div className="parceiros-fornecedor">
            <h4>Fornecedores</h4>
            <div className="logos">
              <img src="/imagens/fornecedor1.jpeg" alt="Fornecedor 1" />
              <img src="/imagens/fornecedor2.png" alt="Fornecedor 2" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default Home;