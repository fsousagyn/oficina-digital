import React, { useState, useEffect, useRef } from 'react';
import './Carrossel.css';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Carrossel = ({ imagens, setImagens, usuario, handleRemoverServidor }) => {
  const [indexAtual, setIndexAtual] = useState(0);
  const carrosselRef = useRef(null);
  console.log('Imagem completa:', `${imagens[indexAtual]}`);
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

    carrossel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carrossel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carrossel.addEventListener('touchend', handleTouchEnd);

    return () => {
      carrossel.removeEventListener('touchstart', handleTouchStart);
      carrossel.removeEventListener('touchmove', handleTouchMove);
      carrossel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [imagens]);

  if (!imagens || imagens.length === 0) {
    return <div className="carrossel-vazio">Nenhuma imagem disponível para exibição.</div>;
  }

  return (
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
  <div className="carrossel-item">
    <img
      src={imagens[indexAtual]}
      alt={`Imagem ${indexAtual + 1}`}
      className="carrossel-img"
    />
    {usuario?.isAdmin && (
  <button
    className="btn-excluir"
    onClick={() =>
      handleRemoverServidor(
        imagens[indexAtual],        // url
        'carrossel',                // tipo
        imagens,                    // lista atual
        (novaLista) => {
          setImagens(novaLista);   // atualiza estado no Home
          setIndexAtual(0);        // reseta índice para evitar erro
        },
        'carrossel',                // storageKey
        `Imagem ${indexAtual + 1}` // rótulo para feedback
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
          setIndexAtual((prev) => (prev + 1) % imagens.length)
        }
      >
        ❯
      </button>

      <div className="indicadores">
        {imagens.map((_, i) => (
          <span key={i} className={`indicador ${i === indexAtual ? 'ativo' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;