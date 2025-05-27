import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CardItem from "../components/CardItem";
import CardForm from "../components/CardForm";

const MyCards = () => {
  const { token, user } = useAuth();
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    axios
      .get("/exchange/cards/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Si el usuario es admin, solo mostrar sus propias cartas en "Mis cartas"
        if (user?.is_staff || user?.is_superuser) {
          setCards(res.data.filter((card) => card.owner === user.username));
        } else {
          setCards(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [token, user]);

  const handleCreateCard = (data, resetForm) => {
    setFormLoading(true);
    axios
      .post("/exchange/cards/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCards((prev) => [...prev, res.data]);
        resetForm();
        setShowForm(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setFormLoading(false));
  };

  const handleOffer = (cardId, newForTrade) => {
    axios
      .patch(
        `/exchange/cards/${cardId}/`,
        { forTrade: newForTrade },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, forTrade: newForTrade } : c))
        );
      })
      .catch((err) => alert("Error al actualizar el estado de intercambio"));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Cartas</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Agregar carta"}
        </button>
      </div>

      <div className="flex flex-wrap gap-8 items-stretch">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onOffer={handleOffer} />
        ))}
      </div>
      {showForm && (
        <CardForm
          onSubmit={handleCreateCard}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default MyCards;
