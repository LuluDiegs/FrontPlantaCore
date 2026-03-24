import api from '../../../lib/axios';

export const postService = {
  create(data) {
    return api.post('/Post', data, { headers: { 'X-Skip-PascalCase': true } }).then((r) => ({ status: r.status, data: r.data }));
  },

  update(postId, conteudo) {
    return api.put(`/Post/${postId}`, { conteudo }).then((r) => r.data);
  },

  delete(postId) {
    return api.delete(`/Post/${postId}`).then((r) => r.data);
  },

  getById(postId) {
    return api.get(`/Post/${postId}`).then((r) => r.data);
  },

  getFeed(pagina = 1, tamanho = 10, ordenarPor) {
    const params = { pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get('/Post/feed', { params }).then((r) => r.data);
  },

  getExplore(pagina = 1, tamanho = 10, ordenarPor) {
    const params = { pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get('/Post/explorar', { params }).then((r) => r.data);
  },

  getByUser(usuarioId, pagina = 1, tamanho = 10, ordenarPor) {
    const params = { pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get(`/Post/usuario/${usuarioId}`, { params }).then((r) => r.data);
  },

  getByCommunity(comunidadeId, pagina = 1, tamanho = 10, ordenarPor) {
    const params = { pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api
      .get(`/Post/comunidade/${comunidadeId}`, { params })
      .then((r) => r.data);
  },

  getLikedByUser(usuarioId) {
    return api.get(`/Post/usuario/${usuarioId}/curtidos`).then((r) => r.data);
  },

  searchByHashtag(hashtag, pagina = 1, tamanho = 20, ordenarPor) {
    const params = { hashtag, pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get('/Post/buscar/hashtag', { params }).then((r) => r.data);
  },

  searchByCategoria(categoria, pagina = 1, tamanho = 20, ordenarPor) {
    const params = { categoria, pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get('/Post/buscar/categoria', { params }).then((r) => r.data);
  },

  searchByPalavraChave(palavraChave, pagina = 1, tamanho = 20, ordenarPor) {
    const params = { palavraChave, pagina, tamanho };
    if (ordenarPor) params.ordenarPor = ordenarPor;
    return api.get('/Post/buscar/palavra-chave', { params }).then((r) => r.data);
  },

  // General search endpoint combining hashtag/categoria/palavraChave and other filters
  search(params) {
    // params can include: hashtag, categoria, palavraChave, usuarioId, comunidadeId, pagina, tamanho
    return api.get('/Post/buscar', { params }).then((r) => r.data);
  },

  save(postId) {
    return api.post(`/Post/${postId}/salvar`).then((r) => r.data);
  },

  unsave(postId) {
    return api.delete(`/Post/${postId}/salvar`).then((r) => r.data);
  },

  share(postId, comentario) {
    // Try to send optional comentario in the share request if backend supports it.
    if (!comentario) return api.post(`/Post/${postId}/compartilhar`).then((r) => r.data);

    return api
      .post(`/Post/${postId}/compartilhar`, { comentario }, { headers: { 'X-Skip-PascalCase': true } })
      .then((r) => r.data)
      .catch(async () => {
        // Fallback: call share without body. If it returns the created/shared post id, attach the comment to the new shared post.
        const shareResp = await api.post(`/Post/${postId}/compartilhar`).then((r) => r.data).catch(() => null);
        let commentResp = null;
        try {
          const newPostId = shareResp?.dados?.id || shareResp?.id || shareResp?.shareId || (shareResp && typeof shareResp === 'object' && shareResp.id) || null;
          if (newPostId) {
            // attach comment to the newly created shared post
            commentResp = await api.post('/Post/comentario', { postId: newPostId, conteudo: comentario }, { headers: { 'X-Skip-PascalCase': true } }).then((r) => r.data);
          } else {
            // best-effort: if we couldn't determine the new post id, do not post comment to the original to avoid mis-attaching;
            // return share response and null comment so caller can decide fallback behavior.
            commentResp = null;
          }
        } catch (e) {
          // ignore secondary failure
        }
        return { share: shareResp, comment: commentResp };
      });
  },

  view(postId) {
    return api.post(`/Post/${postId}/visualizar`).then((r) => r.data);
  },

  // General search helper. tipo can be 'hashtag', 'categoria', or 'palavra-chave'.
  // Defaults to 'palavra-chave' for general searches.
  

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
    return api.post('/Post/comentario', data, { headers: { 'X-Skip-PascalCase': true } }).then((r) => ({ status: r.status, data: r.data }));
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

  replyComment(comentarioId, conteudo) {
    // API expects a body with conteudo (string)
    return api.post(`/Post/comentario/${comentarioId}/responder`, { conteudo }).then((r) => r.data);
  },
};
