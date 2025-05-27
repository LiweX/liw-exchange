import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TradeModal from "../components/TradeModal";

const CardMarket = () => {
  const { token, user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [cardToTrade, setCardToTrade] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [modalCard, setModalCard] = useState(null);

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

  const handleOpenTrade = (card) => {
    setCardToTrade(card);
    setShowTradeModal(true);
    setSuccessMsg("");
  };
  const handleTradeSuccess = () => {
    setShowTradeModal(false);
    setSuccessMsg("¡Propuesta enviada!");
  };
  const handleOpenCardModal = (card) => {
    setModalCard(card);
    setShowCardModal(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mercado de cartas</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-6">
        {cards.length === 0 ? (
          <p>No hay cartas disponibles.</p>
        ) : (
          cards
            .filter(card => card.owner !== user?.username) // Oculta mis propias cartas
            .map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 border rounded shadow w-60 cursor-pointer"
                onClick={() => handleOpenCardModal(card)}
              >
                <h2 className="text-lg font-semibold">{card.name}</h2>
                {card.image_url && (
                  <img src={card.image_url} alt={card.name} className="mt-2 h-40 object-cover" />
                )}
                <p className="text-sm text-gray-500 mt-2">Dueño: {card.owner}</p>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                  onClick={e => { e.stopPropagation(); handleOpenTrade(card); }}
                >
                  Ofrecer intercambio
                </button>
              </div>
            ))
        )}
      </div>
      {showTradeModal && cardToTrade && (
        <TradeModal
          open={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          offeredCard={cardToTrade}
          onSubmit={handleTradeSuccess}
        />
      )}
      {showCardModal && modalCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg flex w-[700px] max-w-full relative">
            <button onClick={() => setShowCardModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">✕</button>
            <div className="flex-1 flex items-center justify-center p-6">
              {modalCard.image_url && (
                <img src={modalCard.image_url} alt={modalCard.name} className="max-h-[400px] object-contain rounded" />
              )}
            </div>
            <div className="flex-1 flex flex-col p-6 min-w-[300px]">
              <h2 className="text-2xl font-bold mb-2">{modalCard.name}</h2>
              <p className="mb-4 text-gray-700">{modalCard.description}</p>
              <div className="mt-auto">
                <p className="text-sm text-gray-500 mb-2">Dueño: {modalCard.owner}</p>
                {modalCard.verified ? (
                  <p className="text-green-600 text-sm mb-2">Verificada</p>
                ) : (
                  <p className="text-yellow-600 text-sm mb-2">Pendiente de verificación</p>
                )}
                {modalCard.forTrade && modalCard.verified && (
                  <p className="text-blue-600 text-sm mb-2">Ofrecida para intercambio</p>
                )}
                {modalCard.owner !== user?.username && (
                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                    onClick={e => { e.stopPropagation(); setShowCardModal(false); handleOpenTrade(modalCard); }}
                  >
                    Ofrecer intercambio
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {successMsg && <div className="text-green-600 mt-4">{successMsg}</div>}
    </div>
  );
};

export default CardMarket;
