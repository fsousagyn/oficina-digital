import React, { useState, useEffect } from 'react';
import Carrossel from './Carrossel';
import Clientes from './Clientes';
import Fornecedores from './Fornecedores';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaCogs, FaLightbulb, FaEye } from 'react-icons/fa';
import Header from '../components/Header';
import UploadComponent from '../components/UploadComponent';
import './Home.css';
const Home = () => {
  const { usuario } = useAuth();
  const [imagens, setImagens] = useState([]);
  const [logosClientes, setLogosClientes] = useState([]);
  const [logosFornecedores, setLogosFornecedores] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    setImagens(JSON.parse(localStorage.getItem('carrossel')) || []);
    setLogosClientes(JSON.parse(localStorage.getItem('clientes')) || []);
    setLogosFornecedores(JSON.parse(localStorage.getItem('fornecedores')) || []);
  }, []);

  const handleRemoverServidor = async (url, tipo, lista, setFunc, storageKey, rotulo) => {
    const partes = url.split('/');
    const filename = partes[partes.length - 1];

    try {
      const res = await fetch(`http://localhost:3001/delete/${tipo}/${filename}`, {
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
console.log('Usuário:', usuario);
  return (
    <section className="tela">
      <h2>Bem-vindo à EF Criativa</h2>

      {usuario?.tipo === 'admin' && (
  <UploadComponent
    categoriaInicial="carrossel"
  onUploadSuccess={(novaImagem) =>
    setImagens((prev) => [...prev, novaImagem])
  }
  />
  )}
  
      <Carrossel
        imagens={imagens}
        usuario={usuario}
        handleRemoverServidor={handleRemoverServidor}
      />

      {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

      <div className="video-institucional">
        <h3>Conheça nossa história</h3>
        <video controls>
          <source src="/video/institucional.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      </div>

      {/* Seção Institucional */}
      <div className="institucional">
        <div className="card">
          <FaCogs className="icon" />
          <h3>Quem Somos</h3>
          <p>
            A EF Criativa une o melhor da tradição artesanal com a inovação digital. Com raízes na marcenaria e serralheria, evoluímos para integrar inteligência e design em soluções sob medida. Cada projeto nasce da sensibilidade estética, da precisão técnica e do desejo de transformar espaços em experiências únicas.
          </p>
        </div>

        <div className="card">
          <FaLightbulb className="icon" />
          <h3>Missão</h3>
          <p>
            Projetar e entregar soluções personalizadas que combinam arte e função, utilizando processos eficientes e tecnologia inteligente. Buscamos atender com excelência, respeitando os sonhos de cada cliente e valorizando o cuidado em cada detalhe.
          </p>
        </div>

        <div className="card">
          <FaEye className="icon" />
          <h3>Visão</h3>
          <p>
            Ser reconhecida como referência em design autoral com propósito — onde o feito à mão encontra o digital. Acreditamos na força da originalidade, da confiança e da inovação contínua para transformar ambientes e gerar impacto positivo.
          </p>
        </div>
      </div>

      <div className="parceiros">
        <h3>Parceiros</h3>
        <div className="parceiros-grupo">
        {usuario?.tipo === 'admin' && (
          <UploadComponent
            categoriaInicial="logosClientes"
            onUploadSuccess={(novaImagem) =>
            setLogosClientes((prev) => [...prev, novaImagem])
  }
          />
        )}
          <Clientes
            logosClientes={logosClientes}
                setLogosClientes={setLogosClientes}
                usuario={usuario}
                handleRemoverServidor={handleRemoverServidor}
          />
        {usuario?.tipo === 'admin' && (
          <UploadComponent
            categoriaInicial="logosFornecedores"
            onUploadSuccess={(novaImagem) =>
            setLogosFornecedores((prev) => [...prev, novaImagem])
  }
          />
        )}
          <Fornecedores
              logosFornecedores={logosFornecedores}
              setLogosFornecedores={setLogosFornecedores}
              usuario={usuario}
              handleRemoverServidor={handleRemoverServidor}
            />
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Home;