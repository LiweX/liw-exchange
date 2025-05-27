import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CardItem from "./CardItem";

const TradeModal = ({ open, onClose, offeredCard, onSubmit }) => {
  const { token, user } = useAuth();
  const [myCards, setMyCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    axios
      .get("/exchange/cards/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Solo cartas verificadas, ofrecidas para intercambio y que sean del usuario logueado
        setMyCards(res.data.filter(c => c.verified && c.forTrade && c.owner === user?.username));
      })
      .catch(() => setError("Error al cargar tus cartas"))
      .finally(() => setLoading(false));
  }, [open, token, user]);

  const handleSubmit = () => {
    if (!selectedCard) return;
    setSubmitting(true);
    axios.post(
      "/exchange/proposals/",
      {
        offered_card_id: selectedCard,
        requested_card_id: offeredCard.id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        onSubmit();
      })
      .catch(() => setError("Error al crear la propuesta"))
      .finally(() => setSubmitting(false));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded shadow-lg p-6 w-[600px] max-w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        <h2 className="text-xl font-bold mb-4">Ofrecer intercambio</h2>
        <p className="mb-2">Seleccioná una de tus cartas para ofrecer a cambio de <b>{offeredCard.name}</b>:</p>
        <div className="mb-4 flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Carta que querés</span>
            <CardItem card={offeredCard} />
          </div>
          <span className="text-4xl mx-4">⇄</span>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Tu carta a ofrecer</span>
            {loading ? (
              <div>Cargando tus cartas...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : myCards.length === 0 ? (
              <div>No tenés cartas disponibles para intercambio.</div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                {myCards.map(card => (
                  <div
                    key={card.id}
                    className={`border rounded p-2 flex items-center gap-2 cursor-pointer transition ${selectedCard === card.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <input
                      type="radio"
                      name="myCard"
                      checked={selectedCard === card.id}
                      onChange={() => setSelectedCard(card.id)}
                      className="accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-semibold">{card.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({card.owner})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          onClick={handleSubmit}
          disabled={!selectedCard || submitting}
        >
          {submitting ? "Enviando..." : "Ofrecer intercambio"}
        </button>
      </div>
    </div>
  );
};

export default TradeModal;
