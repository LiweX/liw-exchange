import React, { useState } from "react";

const CardForm = ({ onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, () => setFormData({ name: "", description: "", image_url: "" }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-xl font-bold mb-4">Agregar carta</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="description"
            type="text"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            name="image_url"
            type="text"
            placeholder="URL de imagen"
            value={formData.image_url}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
