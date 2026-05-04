import api from '../../../lib/axios';

export const profileService = {
  getMyProfile() {
    return api.get('/Usuario/perfil').then((r) => r.data);
  },

  getPublicProfile(usuarioId) {
    return api.get(`/Usuario/perfil-publico/${usuarioId}`).then((r) => r.data);
  },

  updateName(novoNome) {
    return api.put('/Usuario/nome', { novoNome }).then((r) => r.data);
  },

  updateBio(biografia) {
    return api.put('/Usuario/biografia', { biografia }).then((r) => r.data);
  },

  uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('foto', file);
    return api.post('/Usuario/foto-perfil', formData).then((r) => r.data);
  },

  updatePrivacy(privado) {
    return api.put('/Usuario/privacidade', { privado }).then((r) => r.data);
  },

  follow(usuarioId) {
    return api.post(`/Usuario/seguir/${usuarioId}`).then((r) => r.data);
  },

  unfollow(usuarioId) {
    return api.delete(`/Usuario/seguir/${usuarioId}`).then((r) => r.data);
  },

  getFollowers(usuarioId, pagina = 1, tamanho = 20) {
    return api.get(`/Usuario/${usuarioId}/seguidores`, {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getMyFollowers(pagina = 1, tamanho = 20) {
    return api.get('/Usuario/meus-seguidores', {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getFollowing(usuarioId, pagina = 1, tamanho = 20) {
    return api.get(`/Usuario/${usuarioId}/seguindo`, {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getMyFollowing(pagina = 1, tamanho = 20) {
    return api.get('/Usuario/meu-seguindo', {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  // Follow request endpoints for private profiles
  requestFollow(alvoId) {
    return api.post(`/Usuario/solicitacao-seguir/${alvoId}`).then((r) => r.data);
  },

  getFollowRequests() {
    return api.get('/Usuario/solicitacoes-seguir').then((r) => r.data);
  },

  acceptFollowRequest(solicitacaoId) {
    return api.post(`/Usuario/solicitacoes-seguir/${solicitacaoId}/aceitar`).then((r) => r.data);
  },

  rejectFollowRequest(solicitacaoId) {
    return api.post(`/Usuario/solicitacoes-seguir/${solicitacaoId}/rejeitar`).then((r) => r.data);
  },

  requestReactivation(email) {
    return api.post('/Usuario/reativar/solicitar', { email }).then((r) => r.data);
  },

  confirmReactivation(data) {
    return api.post('/Usuario/reativar/confirmar', data).then((r) => r.data);
  },

  verifyReactivationToken(data) {
    return api.post('/Usuario/reativar/verificar-token', data).then((r) => r.data);
  },

  resetReactivationPassword(data) {
    return api.post('/Usuario/reativar/confirmar', data).then((r) => r.data);
  },

  getUserPlants(usuarioId, pagina = 1, tamanho = 12) {
    return api.get(`/Usuario/${usuarioId}/plantas`, {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getUserPosts(usuarioId, pagina = 1, tamanho = 10) {
    return api.get(`/Usuario/${usuarioId}/posts`, {
      params: { pagina, tamanho },
    }).then((r) => r.data);
  },

  getSuggestions(quantidade = 8) {
    return api.get('/Usuario/sugestoes', {
      params: { quantidade },
    }).then((r) => r.data);
  },

  getRelation(usuarioId) {
    return api.get(`/Usuario/${usuarioId}/relacao`).then((r) => r.data);
  },
};
