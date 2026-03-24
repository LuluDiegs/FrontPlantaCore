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

  getFollowing(usuarioId, pagina = 1, tamanho = 20) {
    return api.get(`/Usuario/${usuarioId}/seguindo`, {
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
};
