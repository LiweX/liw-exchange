import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ExchangeList = () => {
  const { token, user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/exchange/proposals/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProposals(res.data))
      .catch((err) => setError("Error al cargar propuestas"))
      .finally(() => setLoading(false));
  }, [token]);

  // Propuestas hechas por el usuario
  const myProposals = proposals.filter(
    (p) => p.proposer === user?.id || p.proposer === user?.username
  );
  // Propuestas recibidas (donde el usuario es dueño de la carta solicitada)
  const receivedProposals = proposals.filter(
    (p) => p.requested_card && p.requested_card.owner === user?.username
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Intercambios</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tus propuestas</h2>
        {myProposals.length === 0 ? (
          <p>No has hecho propuestas de intercambio.</p>
        ) : (
          <ul className="space-y-2">
            {myProposals.map((p) => (
              <li key={p.id} className="bg-gray-100 p-3 rounded shadow">
                Ofreciste tu carta #{p.offered_card} por la carta #{p.requested_card} - Estado: <b>{p.status}</b>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Propuestas recibidas</h2>
        {receivedProposals.length === 0 ? (
          <p>No tienes propuestas recibidas.</p>
        ) : (
          <ul className="space-y-2">
            {receivedProposals.map((p) => (
              <li key={p.id} className="bg-blue-100 p-3 rounded shadow">
                El usuario #{p.proposer} te ofrece la carta #{p.offered_card} por tu carta #{p.requested_card} - Estado: <b>{p.status}</b>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExchangeList;
