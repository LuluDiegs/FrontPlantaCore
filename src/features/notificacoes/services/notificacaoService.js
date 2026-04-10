import api from '../../../lib/axios';

export const notificacaoService = {
  list() {
    return api.get('/Notificacao').then((r) => r.data);
  },

  listNaoLidas() {
    return api.get('/Notificacao/nao-lidas').then((r) => r.data);
  },

  marcarComoLida(notificacaoId) {
    return api.put(`/Notificacao/${notificacaoId}/marcar-como-lida`).then((r) => r.data);
  },

  marcarTodasComoLidas() {
    return api.put('/Notificacao/marcar-todas-como-lidas').then((r) => r.data);
  },

  remove(notificacaoId) {
    return api.delete(`/Notificacao/${notificacaoId}`).then((r) => r.data);
  },

  removeAll() {
    return api.delete('/Notificacao').then((r) => r.data);
  },
  configuracoes() {
    return api.get('/Notificacao/configuracoes').then((r) => r.data);
  },
};

export default notificacaoService;
