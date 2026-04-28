import api from '../../../lib/axios';

export const storeService = {
  getAll() {
    return api.get('/Loja').then((r) => r.data);
  },

  getMine() {
    return api.get('/Loja/minhas').then((r) => r.data);
  },

  getById(id) {
    return api.get(`/Loja/${id}`).then((r) => r.data);
  },

  create(payload) {
    return api.post('/Loja', payload).then((r) => r.data);
  },

  update(id, payload) {
    return api.put(`/Loja/${id}`, payload).then((r) => r.data);
  },

  remove(id) {
    return api.delete(`/Loja/${id}`).then((r) => r.data);
  },
};
