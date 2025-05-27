import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSuccess('Datos guardados correctamente');
    } catch {
      setError('No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Mi perfil</h2>
      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <p><strong>Usuario:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
      <form onSubmit={handleSave} className="bg-white p-4 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            className="w-full border rounded p-2"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Apellido</label>
          <input
            className="w-full border rounded p-2"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Apellido"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}