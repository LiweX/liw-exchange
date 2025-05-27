import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const {token} = useAuth();

  return (
      <Router>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginRegister />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
  );
}

export default App;
