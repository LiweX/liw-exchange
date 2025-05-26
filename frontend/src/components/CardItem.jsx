import React, { useState } from "react";

const CardItem = ({ card, onOffer }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="bg-white p-4 border rounded shadow h-96 w-60 flex flex-col justify-between cursor-pointer"
        onClick={(e) => {
          // Solo abrir modal si el click no viene del checkbox ni su label
          if (
            e.target.tagName !== "INPUT" &&
            e.target.tagName !== "LABEL"
          ) {
            setShowModal(true);
          }
        }}
      >
        <h2 className="text-xl font-semibold">{card.name}</h2>
        {card.image_url && (
          <img src={card.image_url} alt={card.name} className="mt-2 h-64 object-cover" />
        )}
        {card.verified ? (
          <p className="text-green-600 text-sm mt-2">Verificada</p>
        ) : (
          <p className="text-yellow-600 text-sm mt-2">Pendiente de verificación</p>
        )}
        {/* Checkbox para alternar forTrade si está verificada */}
        {onOffer && card.verified && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id={`offer-${card.id}`}
              checked={!!card.forTrade}
              onClick={e => e.stopPropagation()}
              onChange={() => onOffer(card.id, !card.forTrade)}
            />
            <label htmlFor={`offer-${card.id}`} className="text-blue-700 cursor-pointer select-none">
              {card.forTrade ? "Quitar de intercambio" : "Ofrecer para intercambio"}
            </label>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg flex w-[700px] max-w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">✕</button>
            <div className="flex-1 flex items-center justify-center p-6">
              {card.image_url && (
                <img src={card.image_url} alt={card.name} className="max-h-[400px] object-contain rounded" />
              )}
            </div>
            <div className="flex-1 flex flex-col p-6 min-w-[300px]">
              <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
              <p className="mb-4 text-gray-700">{card.description}</p>
              <div className="mt-auto">
                {card.verified ? (
                  <p className="text-green-600 text-sm mb-2">Verificada</p>
                ) : (
                  <p className="text-yellow-600 text-sm mb-2">Pendiente de verificación</p>
                )}
                {/* Checkbox también en el modal */}
                {onOffer && card.verified && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id={`modal-offer-${card.id}`}
                      checked={!!card.forTrade}
                      onClick={e => e.stopPropagation()}
                      onChange={() => { onOffer(card.id, !card.forTrade); }}
                    />
                    <label htmlFor={`modal-offer-${card.id}`} className="text-blue-700 cursor-pointer select-none">
                      {card.forTrade ? "Quitar de intercambio" : "Ofrecer para intercambio"}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardItem;
