import React, { useState, useEffect } from 'react';
import './Clientes.css';

const Clientes = ({ usuario, handleRemoverServidor }) => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const limparLogosInvalidos = () => {
      const logosSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
      const logosValidos = logosSalvos.filter((url) => url && url.startsWith('http'));
      localStorage.setItem('clientes', JSON.stringify(logosValidos));
      setLogos(logosValidos);
    };

    limparLogosInvalidos();
  }, []);

  const removerLogo = (index) => {
    const logoRemovido = logos[index];
    const novaLista = logos.filter((_, i) => i !== index);
    setLogos(novaLista);
    localStorage.setItem('clientes', JSON.stringify(novaLista));

    if (usuario?.isAdmin) {
      handleRemoverServidor(
        logoRemovido,
        'clientes',
        novaLista,
        null,
        'clientes',
        `Logo ${index + 1}`
      );
    }
  };

  if (!logos || logos.length === 0) {
    return <div className="parceiros-cliente">Nenhum logo de cliente disponível.</div>;
  }

  return (
    <div className="parceiros-cliente">
      <h4>Clientes</h4>
      <div className="logos">
        {logos.map((logo, index) => (
          <div key={index} className="logo-item">
            <img src={logo} alt={`Cliente ${index + 1}`} />
            {usuario?.isAdmin && (
              <button className="btn-excluir" onClick={() => removerLogo(index)}>
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clientes;
