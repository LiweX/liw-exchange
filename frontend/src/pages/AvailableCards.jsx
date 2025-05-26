import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AvailableCards = () => {
  const { token, user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/exchange/offers/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCards(res.data))
      .catch(() => setError("Error al cargar cartas disponibles"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cartas disponibles para intercambio</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-6">
        {cards.length === 0 ? (
          <p>No hay cartas disponibles.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="bg-white p-4 border rounded shadow w-60">
              <h2 className="text-lg font-semibold">{card.name}</h2>
              {card.image_url && (
                <img src={card.image_url} alt={card.name} className="mt-2 h-40 object-cover" />
              )}
              <p className="text-gray-700">{card.description}</p>
              <p className="text-sm text-gray-500 mt-2">Dueño: {card.owner}</p>
              {/* Aquí irá el botón para ofrecer intercambio */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableCards;
