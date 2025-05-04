import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister'; // Importar la página de login/registro
import Home from './pages/Home'; // Ejemplo de una página adicional
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />  {/* Página de inicio */}
          <Route path="/auth" element={<LoginRegister />} /> {/* Página de login/registro */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
