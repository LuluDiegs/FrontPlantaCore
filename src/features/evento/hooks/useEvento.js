import { useState } from 'react';
import { eventoService } from '../services/eventoService';

export function useEvento() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await eventoService.getAll();
      setEventos(Array.isArray(data) ? data : data?.dados ?? data?.itens ?? []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id) => eventoService.getById(id);
  const create = async (payload) => eventoService.create(payload);
  const update = async (id, payload) => eventoService.update(id, payload);
  const remove = async (id) => eventoService.remove(id);
  const marcar = async (eventoId) => eventoService.marcarParticipacao(eventoId);
  const desmarcar = async (eventoId) => eventoService.desmarcarParticipacao(eventoId);

  return {
    eventos,
    loading,
    error,
    fetchAll,
    getById,
    create,
    update,
    remove,
    marcar,
    desmarcar,
  };
}
