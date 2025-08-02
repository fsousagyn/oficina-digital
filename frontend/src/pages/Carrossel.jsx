import React, { useState, useEffect, useRef } from 'react';
import './Carrossel.css';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Carrossel = ({ imagens, setImagens, usuario, handleRemoverServidor }) => {
  const [indexAtual, setIndexAtual] = useState(0);
  const carrosselRef = useRef(null);

  const imagensValidas = imagens.filter((img) => img && img.startsWith('http'));

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % imagensValidas.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagensValidas]);

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
            ? (prev - 1 + imagensValidas.length) % imagensValidas.length
            : (prev + 1) % imagensValidas.length
        );
        isDragging = false;
      }
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };

    carrossel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carrossel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carrossel.addEventListener('touchend', handleTouchEnd);

    return () => {
      carrossel.removeEventListener('touchstart', handleTouchStart);
      carrossel.removeEventListener('touchmove', handleTouchMove);
      carrossel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [imagensValidas]);

  if (!imagensValidas || imagensValidas.length === 0) {
    return <div className="carrossel-vazio">Nenhuma imagem disponível para exibição.</div>;
  }

  return (
    <div className="carrossel" ref={carrosselRef}>
      <button
        className="carrossel-btn"
        onClick={() =>
          setIndexAtual((prev) => (prev - 1 + imagensValidas.length) % imagensValidas.length)
        }
      >
        ❮
      </button>

      <div className="carrossel-imagens">
        <div className="carrossel-item">
          <img
            src={imagensValidas[indexAtual]}
            alt={`Imagem ${indexAtual + 1}`}
            className="carrossel-img"
          />
          {usuario?.isAdmin && (
            <button
              className="btn-excluir"
              onClick={() =>
                handleRemoverServidor(
                  imagensValidas[indexAtual],
                  'carrossel',
                  imagensValidas,
                  (novaLista) => {
                    const listaFiltrada = novaLista.filter((img) => img && img.startsWith('http'));
                    localStorage.setItem('carrossel', JSON.stringify(listaFiltrada));
                    setImagens(listaFiltrada);
                    setIndexAtual(0);
                  },
                  'carrossel',
                  `Imagem ${indexAtual + 1}`
                )
              }
            >
              🗑️ Excluir
            </button>
          )}
        </div>
      </div>

      <button
        className="carrossel-btn"
        onClick={() =>
          setIndexAtual((prev) => (prev + 1) % imagensValidas.length)
        }
      >
        ❯
      </button>

      <div className="indicadores">
        {imagensValidas.map((_, i) => (
          <span key={i} className={`indicador ${i === indexAtual ? 'ativo' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;
