import { useState, useEffect } from 'react';
import './Home.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { usuario } = useAuth();
  const [imagens, setImagens] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [mensagem, setMensagem] = useState('');

  // Carregar imagens salvas no localStorage
  useEffect(() => {
    const salvas = localStorage.getItem('carrosselEF');
    if (salvas) {
      setImagens(JSON.parse(salvas));
    } else {
      setImagens([
        '/imagens/projeto1.jpg',
        '/imagens/projeto2.jpg',
        '/imagens/projeto3.jpg',
      ]);
    }
  }, []);

  // Limpar mensagem ao deslogar
  useEffect(() => {
    setMensagem('');
  }, [usuario]);

  const avancar = () => {
    if (imagens.length === 0) return;
    setIndexAtual((prev) => (prev + 1) % imagens.length);
  };

  const voltar = () => {
    if (imagens.length === 0) return;
    setIndexAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const adicionarImagem = () => {
    const input = document.getElementById('nova-imagem');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const novaImagem = event.target.result;

      if (imagens.includes(novaImagem)) {
        setMensagem('⚠️ Esta imagem já foi adicionada.');
        return;
      }

      const atualizadas = [...imagens, novaImagem];
      setImagens(atualizadas);
      localStorage.setItem('carrosselEF', JSON.stringify(atualizadas));
      setIndexAtual(atualizadas.length - 1);
      setMensagem('✅ Imagem adicionada com sucesso!');
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  const excluirImagem = (index) => {
    const novaLista = imagens.filter((_, i) => i !== index);
    setImagens(novaLista);
    localStorage.setItem('carrosselEF', JSON.stringify(novaLista));
    setIndexAtual((prev) => Math.max(0, prev - (index <= prev ? 1 : 0)));
    setMensagem('🗑️ Imagem removida com sucesso!');
  };

  return (
    <section className="tela">
      <h2>Bem-vindo à EF Criativa</h2>

      {/* Carrossel */}
      <div className="carrossel">
        <button className="carrossel-btn" onClick={voltar}>❮</button>
        <div className="carrossel-imagens">
          {imagens.length > 0 && (
            <div className="carrossel-item">
              <img src={imagens[indexAtual]} alt={`Foto ${indexAtual + 1}`} />
              {usuario && (
                <button className="btn-excluir" onClick={() => excluirImagem(indexAtual)}>🗑️</button>
              )}
            </div>
          )}
        </div>
        <button className="carrossel-btn" onClick={avancar}>❯</button>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

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