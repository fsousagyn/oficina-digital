import React from 'react';
import './Clientes.css';
const Clientes = ({ logosClientes, usuario, handleRemoverServidor }) => {
  return (
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
                    'clientes',
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
    </div>
  );
};

export default Clientes;