import api from '../../../lib/axios';

export const plantService = {
  // file: File | Blob
  // comentario: optional string
  // criarPostagem: optional boolean
  identify(file, comentario = null, criarPostagem = null) {
    const formData = new FormData();
    // Backend expects PascalCase field names in multipart
    formData.append('Foto', file);
    if (comentario != null) formData.append('Comentario', comentario);
    if (criarPostagem != null) formData.append('CriarPostagem', String(criarPostagem));

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

  searchMyPlants(termo, pagina = 1, tamanho = 10) {
    return api.get('/Planta/minhas-plantas/buscar', {
      params: { termo, pagina, tamanho },
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
