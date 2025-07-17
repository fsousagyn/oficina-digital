import { createContext, useContext, useState, useEffect } from 'react';

const ClienteContext = createContext();

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(null);

  // Carregar cliente do localStorage ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem('clienteEF');
    if (salvo) {
      setCliente(JSON.parse(salvo));
    }
  }, []);

  const loginCliente = (dados) => {
    setCliente(dados);
    localStorage.setItem('clienteEF', JSON.stringify(dados));
  };

  const logoutCliente = () => {
    setCliente(null);
    localStorage.removeItem('clienteEF');
  };

  return (
    <ClienteContext.Provider value={{ cliente, loginCliente, logoutCliente }}>
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  return useContext(ClienteContext);
}