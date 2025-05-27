import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CardItem from "../components/CardItem";

const ExchangeList = () => {
  const { token, user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [modalCard, setModalCard] = useState(null);
  const [forceModal, setForceModal] = useState(null);

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

  const myProposals = proposals.filter(
    (p) => (p.proposer === user?.id || p.proposer === user?.username) && p.status === "pending"
  );
  const receivedProposals = proposals.filter(
    (p) => p.requested_card && p.requested_card.owner === user?.username && p.status === "pending"
  );
  const completedProposals = proposals.filter(
    (p) => (p.proposer === user?.id || p.proposer === user?.username || (p.requested_card && p.requested_card.owner === user?.username)) && p.status !== "pending"
  );

  const handleProposalAction = (proposalId, status) => {
    axios
      .patch(
        `/exchange/proposals/${proposalId}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId ? { ...p, status } : p
          )
        );
      })
      .catch(() => alert("Error al actualizar la propuesta"));
  };

  // Solo una propuesta expandida a la vez
  const handleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
    setForceModal(null); // Cierra cualquier modal de carta abierto
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Intercambios</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tus propuestas pendientes</h2>
        {myProposals.length === 0 ? (
          <p>No has hecho propuestas de intercambio pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {myProposals.map((p) => (
              <li
                key={p.id}
                className="bg-gray-100 p-3 rounded shadow cursor-pointer hover:bg-gray-200"
                onClick={() => handleExpand(p.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.offered_card.name}</span>
                  <span className="text-gray-500">({p.offered_card.owner})</span>
                  <span className="text-3xl mx-2">→</span>
                  <span className="font-semibold">{p.requested_card.name}</span>
                  <span className="text-gray-500">({p.requested_card.owner})</span>
                  <span className="ml-auto">Estado: <b>{p.status}</b></span>
                </div>
                {expandedId === p.id && (
                  <div className="mt-4 flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="flex-1 flex flex-col items-center">
                      <h3 className="font-semibold mb-2">Tu carta ofrecida</h3>
                      <div onClick={e => { e.stopPropagation(); setForceModal(p.offered_card.id); }}>
                        <CardItem card={p.offered_card} forceModal={forceModal} setForceModal={setForceModal} />
                      </div>
                    </div>
                    <span className="text-5xl mx-4">→</span>
                    <div className="flex-1 flex flex-col items-center">
                      <h3 className="font-semibold mb-2">Carta que querés</h3>
                      <div onClick={e => { e.stopPropagation(); setForceModal(p.requested_card.id); }}>
                        <CardItem card={p.requested_card} forceModal={forceModal} setForceModal={setForceModal} />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Propuestas recibidas pendientes</h2>
        {receivedProposals.length === 0 ? (
          <p>No tienes propuestas recibidas pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {receivedProposals.map((p) => (
              <li
                key={p.id}
                className="bg-blue-100 p-3 rounded shadow cursor-pointer hover:bg-blue-200"
                onClick={() => handleExpand(p.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-800 font-semibold">{p.proposer}</span>
                  <span>te ofrece</span>
                  <span className="font-semibold">{p.offered_card.name}</span>
                  <span className="text-3xl mx-2">→</span>
                  <span className="font-semibold">{p.requested_card.name}</span>
                  <span className="ml-auto">Estado: <b>{p.status}</b></span>
                </div>
                {p.status === "pending" && (
                  <span className="ml-2 text-xs text-gray-500">(Click para aceptar/rechazar)</span>
                )}
                {expandedId === p.id && (
                  <div className="mt-4 flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
                    <div className="flex-1 flex flex-col items-center">
                      <h3 className="font-semibold mb-2">Te ofrecen</h3>
                      <div onClick={e => { e.stopPropagation(); setForceModal(p.offered_card.id); }}>
                        <CardItem card={p.offered_card} forceModal={forceModal} setForceModal={setForceModal} />
                      </div>
                    </div>
                    <span className="text-5xl mx-4">→</span>
                    <div className="flex-1 flex flex-col items-center">
                      <h3 className="font-semibold mb-2">Por tu carta</h3>
                      <div onClick={e => { e.stopPropagation(); setForceModal(p.requested_card.id); }}>
                        <CardItem card={p.requested_card} forceModal={forceModal} setForceModal={setForceModal} />
                      </div>
                    </div>
                    <div className="mt-6 text-center md:text-left w-full">
                      Estado: <b>{p.status}</b>
                      {p.status === "pending" && (
                        <div className="mt-4 flex gap-4 justify-center">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={e => { e.stopPropagation(); handleProposalAction(p.id, "accepted"); }}
                          >
                            Aceptar
                          </button>
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={e => { e.stopPropagation(); handleProposalAction(p.id, "rejected"); }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Intercambios completados</h2>
        {completedProposals.length === 0 ? (
          <p>No tienes intercambios completados.</p>
        ) : (
          <ul className="space-y-2">
            {completedProposals.map((p) => (
              <li key={p.id} className="bg-gray-200 p-3 rounded shadow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.offered_card.name}</span>
                  <span className="text-gray-500">({p.offered_card.owner})</span>
                  <span className="text-3xl mx-2">→</span>
                  <span className="font-semibold">{p.requested_card.name}</span>
                  <span className="text-gray-500">({p.requested_card.owner})</span>
                  <span className="ml-auto">Estado: <b>{p.status}</b></span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {modalCard && (
        <></>
      )}
    </div>
  );
};

export default ExchangeList;
