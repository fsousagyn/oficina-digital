import React, { useState, useEffect } from 'react';
import './Fornecedores.css';

const Fornecedores = ({ usuario, handleRemoverServidor }) => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const logosSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    const logosValidos = logosSalvos.filter((url) => url && url.startsWith('http'));
    setLogos(logosValidos);
  }, []);

  const removerLogo = (index) => {
    const logoRemovido = logos[index];
    const novaLista = logos.filter((_, i) => i !== index);
    setLogos(novaLista);
    localStorage.setItem('fornecedores', JSON.stringify(novaLista));

    if (usuario?.isAdmin) {
      handleRemoverServidor(
        logoRemovido,
        'fornecedores',
        novaLista,
        null,
        'fornecedores',
        `Logo ${index + 1}`
      );
    }
  };

  if (!logos || logos.length === 0) {
    return <div className="parceiros-fornecedor">Nenhum logo de fornecedor disponível.</div>;
  }

  return (
    <div className="parceiros-fornecedor">
      <h4>Fornecedores</h4>
      <div className="logos">
        {logos.map((logo, index) => (
          <div key={index} className="logo-item">
            <img src={logo} alt={`Fornecedor ${index + 1}`} />
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

export default Fornecedores;
