import React, { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "../components/CardItem";
import { useAuth } from "../context/AuthContext";

const AdminCards = () => {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/exchange/cards/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCards(res.data))
      .catch(() => setError("Error al cargar cartas"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleVerify = (cardId, verified) => {
    axios.patch(
      `/exchange/cards/${cardId}/`,
      { verified },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, verified } : c));
    });
  };
  const handleDelete = (cardId) => {
    axios.delete(
      `/exchange/cards/${cardId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setCards(prev => prev.filter(c => c.id !== cardId));
    });
  };

  const pendingCards = cards.filter(card => !card.verified);
  const verifiedCards = cards.filter(card => card.verified);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Administrar Cartas</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <h2 className="text-lg font-semibold mb-2 mt-4">Cartas pendientes de verificación</h2>
      <div className="flex flex-wrap gap-8 items-stretch mb-8">
        {pendingCards.length === 0 ? (
          <p className="text-gray-500">No hay cartas pendientes.</p>
        ) : (
          pendingCards.map((card) => (
            <div key={card.id} className="relative">
              <CardItem card={card} />
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  onClick={() => handleVerify(card.id, true)}
                >
                  Verificar
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  onClick={() => handleDelete(card.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <h2 className="text-lg font-semibold mb-2 mt-4">Todas las cartas</h2>
      <div className="flex flex-wrap gap-8 items-stretch">
        {verifiedCards.length === 0 ? (
          <p className="text-gray-500">No hay cartas verificadas.</p>
        ) : (
          verifiedCards.map((card) => (
            <div key={card.id} className="relative">
              <CardItem card={card} />
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  onClick={() => handleDelete(card.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCards;
