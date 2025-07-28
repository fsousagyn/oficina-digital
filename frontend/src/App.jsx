import PainelAdmin from './components/PainelAdmin'; // ou './components/PainelAdmin' dependendo de onde está
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ComoComprar from './pages/ComoComprar';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';
import CriarUsuarioAdmin from './components/CriarUsuarioAdmin'; // ajuste o caminho conforme a pasta real
function App() {
  return (
    <AuthProvider>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-comprar" element={<ComoComprar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/criar-admin" element={<CriarUsuarioAdmin />} />
          <Route
  path="/admin"
  element={
    <RotaProtegida tipoPermitido="admin">
      <PainelAdmin />
    </RotaProtegida>
  }
/>
        </Routes>
         </>
    </AuthProvider>
  );
}

export default App;