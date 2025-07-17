import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClienteProvider } from './context/ClienteContext';
import './index.css'; // Estilos globais
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ClienteProvider>
        <App />
      </ClienteProvider>
    </AuthProvider>
  </BrowserRouter>
);