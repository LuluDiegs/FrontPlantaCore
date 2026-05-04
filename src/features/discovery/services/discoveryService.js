import api from '../../../lib/axios';

export const discoveryService = {
  search(termo) {
    return api.get('/busca', {
      params: { termo },
    }).then((r) => r.data);
  },

  searchUsers(nome) {
    return api.get('/busca/usuarios', {
      params: { nome },
    }).then((r) => r.data);
  },

  getTrendingPosts(quantidade = 8) {
    return api.get('/Post/trending', {
      params: { quantidade },
    }).then((r) => r.data);
  },

  getUserSuggestions(quantidade = 8) {
    return api.get('/Usuario/sugestoes', {
      params: { quantidade },
    }).then((r) => r.data);
  },
};
