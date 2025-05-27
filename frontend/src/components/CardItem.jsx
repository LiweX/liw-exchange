import React, { useState } from "react";

const CardItem = ({ card, onOffer, forceModal, setForceModal }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    if (forceModal !== undefined && setForceModal) {
      setForceModal(card.id);
    } else {
      setShowModal(true);
    }
  };
  const closeModal = () => {
    if (forceModal !== undefined && setForceModal) {
      setForceModal(null);
    } else {
      setShowModal(false);
    }
  };
  const modalOpen = forceModal !== undefined ? forceModal === card.id : showModal;

  return (
    <>
      <div
        className="bg-white p-4 border rounded shadow min-h-[20rem] w-56 flex flex-col justify-between cursor-pointer overflow-hidden"
        style={{ minHeight: 0 }}
        onClick={(e) => {
          if (
            e.target.tagName !== "INPUT" &&
            e.target.tagName !== "LABEL"
          ) {
            openModal();
          }
        }}
      >
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-xl font-semibold break-words">{card.name}</h2>
          {card.image_url && (
            <div className="flex justify-center items-center mt-2 mb-2" style={{height: '140px'}}>
              <img src={card.image_url} alt={card.name} className="object-contain max-h-full max-w-full rounded" />
            </div>
          )}
          <p className="text-gray-500 text-xs mt-1 break-words">Creador: {card.creator}</p>
          {card.verified ? (
            <p className="text-green-600 text-sm mt-2">Verificada</p>
          ) : (
            <p className="text-yellow-600 text-sm mt-2">Pendiente de verificación</p>
          )}
        </div>
        {/* Checkbox para alternar forTrade si está verificada */}
        {onOffer && card.verified && (
          <div className="mt-4 flex items-center gap-2 w-full">
            <input
              type="checkbox"
              id={`offer-${card.id}`}
              checked={!!card.forTrade}
              onClick={e => e.stopPropagation()}
              onChange={() => onOffer(card.id, !card.forTrade)}
              className="shrink-0"
            />
            <label htmlFor={`offer-${card.id}`} className="text-blue-700 cursor-pointer select-none truncate w-full">
              {card.forTrade ? "Quitar de intercambio" : "Ofrecer para intercambio"}
            </label>
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" onClick={closeModal}>
          <div className="bg-white rounded shadow-lg flex w-[700px] max-w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">✕</button>
            <div className="flex-1 flex items-center justify-center p-6">
              {card.image_url && (
                <img src={card.image_url} alt={card.name} className="max-h-[400px] object-contain rounded" />
              )}
            </div>
            <div className="flex-1 flex flex-col p-6 min-w-[300px]">
              <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
              <p className="mb-4 text-gray-700">{card.description}</p>
              <p className="text-gray-500 text-xs mb-2">Creador: {card.creator}</p>
              <div className="mt-auto">
                {card.verified ? (
                  <p className="text-green-600 text-sm mb-2">Verificada</p>
                ) : (
                  <p className="text-yellow-600 text-sm mb-2">Pendiente de verificación</p>
                )}
                {card.forTrade && card.verified && (
                  <p className="text-blue-600 text-sm mb-2">Ofrecida para intercambio</p>
                )}
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
