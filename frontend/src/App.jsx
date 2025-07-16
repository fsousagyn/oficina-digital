import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ComoComprar from './pages/ComoComprar';
import Login from './pages/Login';
import Header from './components/Header'; // Ajuste o caminho conforme a pasta
import Footer from './components/Footer';
function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/como-comprar" element={<ComoComprar />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  );
}

export default App;
