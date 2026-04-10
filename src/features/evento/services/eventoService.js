import api from '../../../lib/axios';

export const eventoService = {
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
    return api.put(`/Evento/${id}`, data).then((r) => r.data);
  },

  markParticipacao(eventoId) {
    return api.put('/Evento/marcar-participacao', null, { params: { eventoId } }).then((r) => r.data);
  },

  unmarkParticipacao(eventoId) {
    return api.put('/Evento/desmarcar-participacao', null, { params: { eventoId } }).then((r) => r.data);
  },

  remove(eventoId) {
    return api.delete(`/Evento/${eventoId}`).then((r) => r.data);
  },
};

export default eventoService;
