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

  getMinhas: async (pagina = 1, tamanho = 10) => {
    const { data } = await api.get('/Comunidade/minhas', {
      params: { pagina, tamanho },
    });
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

  update: async (comunidadeId, payload) => {
    const { data } = await api.put(`/Comunidade/${comunidadeId}`, payload);
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

  expulsar: async (comunidadeId, usuarioId) => {
    const { data } = await api.delete(
      `/Comunidade/${comunidadeId}/expulsar/${usuarioId}`
    );
    return data;
  },

  transferirAdmin: async (comunidadeId, novoAdminId) => {
    const { data } = await api.put(
      `/Comunidade/${comunidadeId}/transferir-admin`,
      { novoAdminId }
    );
    return data;
  },

  recomendadas: async (quantidade = 10) => {
    const { data } = await api.get('/Comunidade/recomendadas', {
      params: { quantidade },
    });
    return data;
  },

  getMembros: async (comunidadeId) => {
    const { data } = await api.get(`/Comunidade/${comunidadeId}/membros`);
    return data;
  },

  getAdmins: async (comunidadeId) => {
    const { data } = await api.get(`/Comunidade/${comunidadeId}/admins`);
    return data;
  },

  souMembro: async (comunidadeId) => {
    const { data } = await api.get(`/Comunidade/${comunidadeId}/sou-membro`);
    return data;
  },

  solicitarEntrada: async (comunidadeId) => {
    const { data } = await api.post(
      `/Comunidade/${comunidadeId}/solicitar-entrada`
    );
    return data;
  },

  solicitacoes: async (comunidadeId) => {
    const { data } = await api.get(
      `/Comunidade/${comunidadeId}/solicitacoes`
    );
    return data;
  },

  aprovarSolicitacao: async (comunidadeId, usuarioId) => {
    const { data } = await api.put(
      `/Comunidade/${comunidadeId}/solicitacoes/${usuarioId}/aprovar`
    );
    return data;
  },

  getByUsuario: async (usuarioId, pagina = 1, tamanho = 10) => {
    const { data } = await api.get(`/Comunidade/usuario/${usuarioId}`, {
      params: { pagina, tamanho },
    });
    return data;
  },
};