import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ComoComprar from './pages/ComoComprar';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-comprar" element={<ComoComprar />} />
          <Route path="/login" element={<Login />} />
        </Routes>
         </>
    </AuthProvider>
  );
}

export default App;