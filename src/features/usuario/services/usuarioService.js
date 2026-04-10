import api from '../../../lib/axios';

export const usuarioService = {
  getProfile() {
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

  updatePrivacy(privado) {
    return api.put('/Usuario/privacidade', { privado }).then((r) => r.data);
  },

  uploadProfilePhoto(file) {
    const fd = new FormData();
    fd.append('foto', file);
    return api.post('/Usuario/foto-perfil', fd).then((r) => r.data);
  },

  deleteAccount() {
    return api.delete('/Usuario/conta').then((r) => r.data);
  },

  // Seguir / deixar de seguir
  follow(usuarioId) {
    return api.post(`/Usuario/seguir/${usuarioId}`).then((r) => r.data);
  },

  unfollow(usuarioId) {
    return api.delete(`/Usuario/seguir/${usuarioId}`).then((r) => r.data);
  },

  getFollowers(usuarioId, pagina = 1, tamanho = 20) {
    return api.get(`/Usuario/${usuarioId}/seguidores`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getFollowing(usuarioId, pagina = 1, tamanho = 20) {
    return api.get(`/Usuario/${usuarioId}/seguindo`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getUserPlants(usuarioId, pagina = 1, tamanho = 12) {
    return api.get(`/Usuario/${usuarioId}/plantas`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getUserPosts(usuarioId, pagina = 1, tamanho = 10) {
    return api.get(`/Usuario/${usuarioId}/posts`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getSavedPosts(pagina = 1, tamanho = 10) {
    // Returns posts saved by the current authenticated user
    return api.get('/Usuario/posts-salvos', { params: { pagina, tamanho } }).then((r) => r.data);
  },

  // Reativacao de conta (endpoints auxiliares do backend)
  requestReactivate(email) {
    return api.post('/Usuario/reativar/solicitar', { email }).then((r) => r.data);
  },

  confirmReactivate(data) {
    return api.post('/Usuario/reativar/confirmar', data).then((r) => r.data);
  },

  verifyReactivateToken(data) {
    return api.post('/Usuario/reativar/verificar-token', data).then((r) => r.data);
  },

  resetReactivate(data) {
    return api.post('/Usuario/reativar/resetar-senha', data).then((r) => r.data);
  },

  // Follow request (for private profiles)
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

export default usuarioService;
