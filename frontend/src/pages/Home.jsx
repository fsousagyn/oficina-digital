import { useState, useEffect, useRef } from 'react';
import './Home.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaCogs, FaLightbulb, FaEye } from 'react-icons/fa';

function Home() {
  const { usuario } = useAuth();
  const [imagens, setImagens] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const carrosselRef = useRef(null);
  const [logosClientes, setLogosClientes] = useState([]);
  const [logosFornecedores, setLogosFornecedores] = useState([]);

  useEffect(() => {
    setImagens(JSON.parse(localStorage.getItem('carrosselEF')) || []);
    setLogosClientes(JSON.parse(localStorage.getItem('logosClientes')) || []);
    setLogosFornecedores(JSON.parse(localStorage.getItem('logosFornecedores')) || []);
  }, []);

  useEffect(() => {
    setMensagem('');
  }, [usuario]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagens]);

  useEffect(() => {
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    let startX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        setIndexAtual((prev) =>
          diff > 0
            ? (prev - 1 + imagens.length) % imagens.length
            : (prev + 1) % imagens.length
        );
        isDragging = false;
      }
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };

    carrossel.addEventListener('touchstart', handleTouchStart);
    carrossel.addEventListener('touchmove', handleTouchMove);
    carrossel.addEventListener('touchend', handleTouchEnd);

    return () => {
      carrossel.removeEventListener('touchstart', handleTouchStart);
      carrossel.removeEventListener('touchmove', handleTouchMove);
      carrossel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [imagens]);

  const handleUpload = async (event, tipo, lista, setFunc, storageKey) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagem', file);

    try {
      const res = await fetch(`/upload/${tipo}`, {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error('Resposta não é JSON:', text);
        setMensagem('❌ Resposta inválida do servidor');
        return;
      }

      if (!data.url) {
        setMensagem('❌ Upload falhou ou sem URL');
        return;
      }

      const url = data.url;

      if (lista.includes(url)) {
        setMensagem('⚠️ Esta imagem já foi adicionada.');
        return;
      }

      const atualizadas = [...lista, url];
      setFunc(atualizadas);
      localStorage.setItem(storageKey, JSON.stringify(atualizadas));
      setMensagem('✅ Imagem enviada com sucesso!');
    } catch (err) {
      setMensagem('❌ Erro ao enviar imagem');
      console.error(err);
    }
  };

  const handleRemoverServidor = async (url, tipo, lista, setFunc, storageKey, rotulo) => {
    const partes = url.split('/');
    const filename = partes[partes.length - 1];

    try {
      const res = await fetch(`/delete/${tipo}/${filename}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.sucesso) {
        const novaLista = lista.filter(item => item !== url);
        setFunc(novaLista);
        localStorage.setItem(storageKey, JSON.stringify(novaLista));
        setMensagem(`🗑️ ${rotulo} removida com sucesso!`);
      } else {
        setMensagem(`❌ Erro: ${data.erro}`);
      }
    } catch (err) {
      setMensagem('❌ Falha na exclusão');
      console.error(err);
    }
  };
  return (
    <section className="tela">
      <h2>Bem-vindo à EF Criativa</h2>

      <div className="carrossel" ref={carrosselRef}>
        <button
          className="carrossel-btn"
          onClick={() =>
            setIndexAtual((prev) => (prev - 1 + imagens.length) % imagens.length)
          }
        >
          ❮
        </button>

        <div className="carrossel-imagens">
          {imagens.length > 0 && (
            <div className="carrossel-item">
              <img src={imagens[indexAtual]} alt={`Imagem ${indexAtual + 1}`} />
              {usuario && (
                <button
                  className="btn-excluir"
                  onClick={() =>
                    handleRemoverServidor(
                      imagens[indexAtual],
                      'carrossel',
                      imagens,
                      setImagens,
                      'carrosselEF',
                      'Imagem'
                    )
                  }
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>

        <button
          className="carrossel-btn"
          onClick={() => setIndexAtual((prev) => (prev + 1) % imagens.length)}
        >
          ❯
        </button>

        <div className="indicadores">
          {imagens.map((_, i) => (
            <span
              key={i}
              className={`indicador ${i === indexAtual ? 'ativo' : ''}`}
            />
          ))}
        </div>
      </div>

      {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

      {usuario && (
        <div className="upload-carrossel">
          <label>Adicionar nova imagem ao carrossel:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleUpload(e, 'carrossel', imagens, setImagens, 'carrosselEF')
            }
          />
        </div>
      )}

      <div className="video-institucional">
        <h3>Conheça nossa história</h3>
        <video controls>
          <source src="/video/institucional.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      </div>

      <div className="institucional">
        {[
          {
            Icon: FaCogs,
            titulo: 'Quem Somos',
            texto:
              'A EF Criativa une o melhor da tradição artesanal com a inovação digital...',
          },
          {
            Icon: FaLightbulb,
            titulo: 'Missão',
            texto:
              'Projetar soluções personalizadas com arte e tecnologia...',
          },
          {
            Icon: FaEye,
            titulo: 'Visão',
            texto:
              'Ser referência em design autoral com propósito...',
          },
        ].map(({ Icon, titulo, texto }, i) => (
          <div className="card" key={i}>
            <Icon className="icon" />
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
        ))}
      </div>

      <div className="parceiros">
        <h3>Parceiros</h3>
        <div className="parceiros-grupo">
          <div className="parceiros-cliente">
            <h4>Clientes</h4>
            <div className="logos">
              {logosClientes.map((logo, index) => (
                <div key={index} className="logo-item">
                  <img src={logo} alt={`Cliente ${index + 1}`} />
                  {usuario && (
                    <button
                      className="btn-excluir"
                      onClick={() =>
                        handleRemoverServidor(
                          logo,
                          'clientes',
                          logosClientes,
                          setLogosClientes,
                          'logosClientes',
                          'Logo de cliente'
                        )
                      }
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
            {usuario && (
              <div className="upload-logo">
                <label>Adicionar logo de cliente:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleUpload(
                      e,
                      'clientes',
                      logosClientes,
                      setLogosClientes,
                      'logosClientes'
                    )
                  }
                />
              </div>
            )}
          </div>

          <div className="parceiros-fornecedor">
            <h4>Fornecedores</h4>
            <div className="logos">
              {logosFornecedores.map((logo, index) => (
                <div key={index} className="logo-item">
                  <img src={logo} alt={`Fornecedor ${index + 1}`} />
                  {usuario && (
                    <button
                      className="btn-excluir"
                      onClick={() =>
                        handleRemoverServidor(
                          logo,
                          'fornecedores',
                          logosFornecedores,
                          setLogosFornecedores,
                          'logosFornecedores',
                          'Logo de fornecedor'
                        )
                      }
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
            {usuario && (
              <div className="upload-logo">
                <label>Adicionar logo de fornecedor:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleUpload(
                      e,
                      'fornecedores',
                      logosFornecedores,
                      setLogosFornecedores,
                      'logosFornecedores'
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default Home;
