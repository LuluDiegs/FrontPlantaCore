import api from '../../../lib/axios';

export const notificationService = {
  getAll() {
    return api.get('/Notificacao').then((r) => r.data);
  },

  getUnread() {
    return api.get('/Notificacao/nao-lidas').then((r) => r.data);
  },

  markAsRead(notificacaoId) {
    return api.put(`/Notificacao/${notificacaoId}/marcar-como-lida`).then((r) => r.data);
  },

  markAllAsRead() {
    return api.put('/Notificacao/marcar-todas-como-lidas').then((r) => r.data);
  },

  delete(notificacaoId) {
    return api.delete(`/Notificacao/${notificacaoId}`).then((r) => r.data);
  },

  deleteAll() {
    return api.delete('/Notificacao').then((r) => r.data);
  },
  getConfiguracoes() {
    return api.get('/Notificacao/configuracoes').then((r) => r.data);
  },
  updateConfiguracoes(configuracoes) {
    return api.put('/Notificacao/configuracoes', configuracoes).then((r) => r.data);
  },
};
