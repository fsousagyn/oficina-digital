import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ComoComprar from './pages/ComoComprar';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/como-comprar" element={<ComoComprar />} />
    </Routes>
  );
}

export default App;

