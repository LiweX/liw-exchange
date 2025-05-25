import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl mb-4">Mi perfil</h2>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Usuario:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
}