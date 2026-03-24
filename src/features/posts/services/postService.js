import api from '../../../lib/axios';

export const postService = {
  create(data) {
    return api.post('/Post', data).then((r) => r.data);
  },

  update(postId, conteudo, hashtags = []) {
    return api.put(`/Post/${postId}`, { conteudo, hashtags }).then((r) => r.data);
  },

  delete(postId) {
    return api.delete(`/Post/${postId}`).then((r) => r.data);
  },

  getById(postId) {
    return api.get(`/Post/${postId}`).then((r) => r.data);
  },

  getFeed(pagina = 1, tamanho = 10) {
    return api.get('/Post/feed', { params: { pagina, tamanho } }).then((r) => r.data);
  },
  
  getByHashtag(hashtag, pagina = 1, tamanho = 10) {
    return api.get(`/Post/hashtag/${encodeURIComponent(hashtag)}`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getExplore(pagina = 1, tamanho = 10) {
    return api.get('/Post/explorar', { params: { pagina, tamanho } }).then((r) => r.data);
  },

  getByUser(usuarioId, pagina = 1, tamanho = 10) {
    return api.get(`/Post/usuario/${usuarioId}`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  like(postId) {
    return api.post(`/Post/${postId}/curtir`).then((r) => r.data);
  },

  unlike(postId) {
    return api.delete(`/Post/${postId}/curtida`).then((r) => r.data);
  },

  getComments(postId, pagina = 1, tamanho = 20) {
    return api.get(`/Post/${postId}/comentarios`, { params: { pagina, tamanho } }).then((r) => r.data);
  },

  createComment(data) {
    return api.post('/Post/comentario', data).then((r) => r.data);
  },

  deleteComment(comentarioId) {
    return api.delete(`/Post/comentario/${comentarioId}`).then((r) => r.data);
  },

  likeComment(comentarioId) {
    return api.post(`/Post/comentario/${comentarioId}/curtir`).then((r) => r.data);
  },

  unlikeComment(comentarioId) {
    return api.delete(`/Post/comentario/${comentarioId}/curtida`).then((r) => r.data);
  },
};
