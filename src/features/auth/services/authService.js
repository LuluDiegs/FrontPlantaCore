import api from '../../../lib/axios';

export const authService = {
  login(credentials) {
    return api.post('/Autenticacao/login', credentials).then((r) => r.data);
  },

  register(data) {
    return api.post('/Autenticacao/registrar', data).then((r) => r.data);
  },

  confirmEmail(data) {
    return api.post('/Autenticacao/confirmar-email', data).then((r) => r.data);
  },

  forgotPassword(email) {
    return api.post('/Autenticacao/resetar-senha', { email }).then((r) => r.data);
  },

  resetPassword(data) {
    return api.post('/Autenticacao/nova-senha', data).then((r) => r.data);
  },

  resendConfirmation(email) {
    return api.post('/Autenticacao/reenviar-confirmacao', { email }).then((r) => r.data);
  },

  logout() {
    return api.post('/Autenticacao/logout').then((r) => r.data);
  },

  changePassword(data) {
    return api.post('/Autenticacao/trocar-senha', data).then((r) => r.data);
  },

  deleteAccount(senha) {
    return api.delete('/Usuario/conta').then((r) => r.data);
  },

  refreshToken(tokenRefresh) {
    return api.post('/Autenticacao/refresh-token', { tokenRefresh }).then((r) => r.data);
  },
};
