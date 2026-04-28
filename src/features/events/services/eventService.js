import api from '../../../lib/axios';

export const eventsService = {
  getAll() {
    return api.get('/Evento').then((r) => r.data);
  },

  getById(id) {
    return api.get(`/Evento/${id}`).then((r) => r.data);
  },

  create(data) {
    return api.post('/Evento', data).then((r) => r.data);
  },

	update(id, data) {
		return api.put(`/Evento/${id}`, data).then(r => r.data);
	},

  delete(id) {
    return api.delete(`/Evento/${id}`).then((r) => r.data);
  },

  join(eventoId) {
    return api.post(`/Evento/${eventoId}/participacao`).then((r) => r.data);
  },

  leave(eventoId) {
    return api.delete(`/Evento/${eventoId}/participacao`).then((r) => r.data);
  },

  getParticipants(eventoId) {
    return api.get(`/Evento/${eventoId}/participantes`).then((r) => r.data);
  },
};
