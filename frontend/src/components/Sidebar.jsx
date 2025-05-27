import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();


const handleLogout = () => {
  logout();
  navigate('/login');
};

  return (
    <div className="w-60 bg-gray-800 text-white p-4 flex flex-col h-full m-auto justify-between">
      <h2 className="text-xl font-bold mb-6">liw-exchange</h2>
      <div className="flex flex-col gap-6">
      <Link to="/dashboard/cards" className="mb-4 hover:text-gray-300">Mis cartas</Link>
      <Link to="/dashboard/available-cards" className="mb-4 hover:text-gray-300">Mercado de cartas</Link>
      <Link to="/dashboard/exchanges" className="mb-4 hover:text-gray-300">Intercambios</Link>
      <Link to="/dashboard/profile" className="mb-4 hover:text-gray-300">Mi perfil</Link>
      {user?.is_staff || user?.is_superuser ? (
        <Link to="/dashboard/admin-cards" className="mb-4 hover:text-green-300">Admin Cartas</Link>
      ) : null}
      </div>
      <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-200">Cerrar sesión</button>
    </div>
  );
}