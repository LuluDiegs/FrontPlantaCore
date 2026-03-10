import api from '../../../lib/axios';

export const plantService = {
  identify(file) {
    const formData = new FormData();
    formData.append('foto', file);
    return api.post('/Planta/identificar', formData, {
      timeout: 60000,
    }).then((r) => r.data);
  },

  search(nomePlanta, pagina = 1) {
    return api.post('/Planta/buscar', { nomePlanta, pagina }).then((r) => r.data);
  },

  addFromSearch(data) {
    return api.post('/Planta/buscar/adicionar', data).then((r) => r.data);
  },

  getMyPlants(pagina = 1, tamanho = 12) {
    return api.get('/Planta/minhas-plantas', {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getById(plantaId) {
    return api.get(`/Planta/${plantaId}`).then((r) => r.data);
  },

  delete(plantaId) {
    return api.delete(`/Planta/${plantaId}`).then((r) => r.data);
  },

  generateCareReminder(plantaId) {
    return api.post(`/Planta/${plantaId}/gerar-lembrete-cuidado`).then((r) => r.data);
  },
};
