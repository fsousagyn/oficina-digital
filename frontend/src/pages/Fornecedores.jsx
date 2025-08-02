import React from 'react';
import './Fornecedores.css';
const Fornecedores = ({ logosFornecedores, setLogosFornecedores, usuario, handleRemoverServidor }) => {
  return (
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
                    'fornecedores',
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
    </div>
  );
};

export default Fornecedores;