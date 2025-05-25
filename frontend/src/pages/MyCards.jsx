import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyCards = () => {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "" });

  useEffect(() => {
    if (!token) return;

    axios
      .get("/exchange/cards/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/exchange/cards/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCards((prev) => [...prev, res.data]);
        setFormData({ name: "", description: "", image_url: "" });
        setShowForm(false);
      })
      .catch((err) => console.error(err));
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

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="URL de imagen"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="flex flex-row gap-14">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-4 border rounded shadow h-96 w-60">
            <h2 className="text-xl font-semibold">{card.name}</h2>
            {card.image_url && (
              <img src={card.image_url} alt={card.name} className="mt-2 h-64 object-cover" />
            )}
            <p className="text-gray-700">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCards;
