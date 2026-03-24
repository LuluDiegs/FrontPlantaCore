import api from '../../../lib/axios';

export const comunidadeService = {
  getAll: async (pagina = 1, tamanho = 10) => {
    const { data } = await api.get('/Comunidade', {
      params: { pagina, tamanho },
    });
    return data;
  },

  getById: async (comunidadeId) => {
    const { data } = await api.get(`/Comunidade/${comunidadeId}`);
    return data;
  },

  delete: async (comunidadeId) => {
  const { data } = await api.delete(`/Comunidade/${comunidadeId}`);
  return data;
},

  getMinhas: async () => {
    const { data } = await api.get('/Comunidade/minhas');
    return data;
  },

  buscar: async (termo) => {
    const { data } = await api.get('/Comunidade/buscar', {
      params: { termo },
    });
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/Comunidade', payload);
    return data;
  },

  entrar: async (comunidadeId) => {
    const { data } = await api.post(`/Comunidade/${comunidadeId}/entrar`);
    return data;
  },

  sair: async (comunidadeId) => {
    const { data } = await api.delete(`/Comunidade/${comunidadeId}/sair`);
    return data;
  },

  getPosts: async (comunidadeId, pagina = 1, tamanho = 10) => {
    const { data } = await api.get(`/Comunidade/${comunidadeId}/posts`, {
      params: { pagina, tamanho },
    });
    return data;
  },
};