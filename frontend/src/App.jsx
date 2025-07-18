import PainelAdmin from './components/PainelAdmin'; // ou './components/PainelAdmin' dependendo de onde está
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ComoComprar from './pages/ComoComprar';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';
function App() {
  return (
    <AuthProvider>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-comprar" element={<ComoComprar />} />
          <Route path="/login" element={<Login />} />
          <Route
  path="/admin"
  element={
    <RotaProtegida>
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