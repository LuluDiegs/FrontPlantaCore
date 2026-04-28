import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';

export function useFeed(options = {}) {
  return useInfiniteQuery({
    queryKey: ['feed', options?.ordenarPor],
    queryFn: ({ pageParam = 1 }) => postService.getFeed(pageParam, options?.tamanho || 10, options?.ordenarPor),
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar feed';
      toast.error(msg);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      // support multiple response shapes: array directly or { dados: { itens: [...] , temProxima } } or { dados: [...] }
      const pageSize = options?.tamanho || 10;
      const dados = lastPage.dados ?? lastPage;
      const itens = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      if (dados?.temProxima !== undefined) {
        return dados.temProxima ? allPages.length + 1 : undefined;
      }
      if (!itens || itens.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const dados = page.dados ?? page;
      const arr = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      return arr;
    }),
  });
}

export function useExplore(options = {}) {
  return useInfiniteQuery({
    queryKey: ['explore', options?.ordenarPor],
    queryFn: ({ pageParam = 1 }) => postService.getExplore(pageParam, options?.tamanho || 10, options?.ordenarPor),
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar explorar';
      toast.error(msg);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const pageSize = options?.tamanho || 10;
      const dados = lastPage.dados ?? lastPage;
      if (dados?.temProxima !== undefined) return dados.temProxima ? allPages.length + 1 : undefined;
      const itens = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      if (!itens || itens.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const dados = page.dados ?? page;
      const arr = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      return Array.isArray(arr) ? arr.filter((p) => !p?.comunidadeId && !p?.comunidade) : [];
    }),
  });
}


export function useUserPosts(usuarioId, options = {}) {
  return useInfiniteQuery({
    queryKey: ['userPosts', usuarioId, options?.ordenarPor],
    queryFn: ({ pageParam = 1 }) => postService.getByUser(usuarioId, pageParam, options?.tamanho || 10, options?.ordenarPor),
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar posts do usuário';
      toast.error(msg);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const pageSize = options?.tamanho || 10;
      const dados = lastPage.dados ?? lastPage;
      if (dados?.temProxima !== undefined) return dados.temProxima ? allPages.length + 1 : undefined;
      const itens = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      if (!itens || itens.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const dados = page.dados ?? page;
      const arr = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      return Array.isArray(arr) ? arr.filter((p) => !p?.comunidadeId && !p?.comunidade) : [];
    }),
    enabled: !!usuarioId,
  });
}

export function usePostDetail(postId) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getById(postId),
    select: (data) => data.dados,
    enabled: !!postId,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar post';
      toast.error(msg);
    },
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: (res) => {
      const status = res?.status;
      const body = res?.data ?? res;
      if (status === 201 || body?.sucesso) {
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['userPosts'] });
        qc.invalidateQueries({ queryKey: ['myProfile'] });
        toast.success(body?.mensagem || 'Post publicado!');
        navigate('/feed');
      } else {
        toast.error(body?.mensagem || 'Erro ao publicar');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.mensagem || 'Erro ao publicar post');
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postService.delete,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['explore'] });
      qc.invalidateQueries({ queryKey: ['userPosts'] });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      const msg = data?.mensagem || 'Post removido';
      toast.success(msg);
    },
    onError: (err) => toast.error(err.response?.data?.mensagem || 'Erro ao remover post'),
  });
}

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }) =>
      isLiked ? postService.unlike(postId) : postService.like(postId),

    onMutate: async ({ postId, isLiked }) => {
      const queryKeys = [['feed'], ['explore'], ['communityFeed'], ['post', postId], ['userPosts']];

      // cancel ongoing queries and capture previous snapshots for rollback
      const previous = {};
      for (const key of queryKeys) {
        await qc.cancelQueries({ queryKey: key });
        previous[JSON.stringify(key)] = qc.getQueryData(key);
      }

      const updatePost = (post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          curtiuUsuario: !isLiked,
          totalCurtidas: (post.totalCurtidas || 0) + (isLiked ? -1 : 1),
        };
      };

      // Atualiza o cache do post individual
      qc.setQueryData(['post', postId], (old) => {
        if (!old?.dados) return old;
        return { ...old, dados: updatePost(old.dados) };
      });

      // Atualiza nas listas (feed, explore, userPosts, communityFeed)
      const mapPagesUpdate = (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            dados: Array.isArray(page.dados)
              ? page.dados.map(updatePost)
              : page.dados?.itens
                ? { ...page.dados, itens: page.dados.itens.map(updatePost) }
                : page.dados,
          })),
        };
      };

      qc.setQueriesData({ queryKey: ['feed'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['explore'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['communityFeed'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['userPosts'] }, mapPagesUpdate);

      return { previous };
    },

    onError: (err, _vars, context) => {
      // rollback to previous snapshots when available
      if (context?.previous) {
        for (const keyStr of Object.keys(context.previous)) {
          try {
            const key = JSON.parse(keyStr);
            qc.setQueryData(key, context.previous[keyStr]);
          } catch (e) {
            // ignore parse errors
          }
        }
      } else {
        qc.invalidateQueries({ queryKey: ['post'] });
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['explore'] });
        qc.invalidateQueries({ queryKey: ['communityFeed'] });
        qc.invalidateQueries({ queryKey: ['userPosts'] });
        qc.invalidateQueries({ queryKey: ['savedPosts'] });
      }

      const msg = err?.response?.data?.mensagem || 'Erro ao curtir';
      toast.error(msg);
    },
    onSuccess: (data) => {
      // show backend message if present
      if (data?.mensagem) toast.success(data.mensagem);
    },
  });
}

export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postService.getComments(postId),
    select: (data) => data.dados || [],
    enabled: !!postId,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar comentários';
      toast.error(msg);
    },
  });
}

export function useCommunityFeed(comunidadeId, options = {}) {
  return useInfiniteQuery({
    queryKey: ['communityFeed', comunidadeId, options?.ordenarPor],
    queryFn: ({ pageParam = 1 }) => postService.getByCommunity(comunidadeId, pageParam, options?.tamanho || 10, options?.ordenarPor),
    enabled: !!comunidadeId,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const pageSize = options?.tamanho || 10;
      const dados = lastPage.dados ?? lastPage;
      if (dados?.temProxima !== undefined) return dados.temProxima ? allPages.length + 1 : undefined;
      const itens = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      if (!itens || itens.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const dados = page.dados ?? page;
      const arr = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      return Array.isArray(arr) ? arr : [];
    }),
    keepPreviousData: true,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar feed da comunidade';
      toast.error(msg);
    },
  });
}

export function useSearchFeed(params) {
  return useInfiniteQuery({
    queryKey: ['searchFeed', params],
    queryFn: ({ pageParam = 1 }) => {
      const p = params || {};
      const q = (p.q || '').trim();

      if (p.mode === 'hashtag') return postService.searchByHashtag(q);
      if (p.mode === 'categoria') return postService.searchByCategoria(q);
      if (p.mode === 'palavra') return postService.searchByPalavraChave(q);
      if (p.mode === 'usuario') return postService.getByUser(q, pageParam, p.tamanho || 10, p.ordenarPor);
      if (p.mode === 'comunidade') return postService.getByCommunity(q, pageParam, p.tamanho || 10, p.ordenarPor);

      return postService.search(q || p.palavraChave || p.hashtag || p.categoria || '');
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const pageSize = params?.tamanho || 10;
      const dados = lastPage.dados ?? lastPage;
      if (dados?.posts || Array.isArray(lastPage?.posts)) return undefined;
      if (dados?.temProxima !== undefined) return dados.temProxima ? allPages.length + 1 : undefined;
      const itens = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      if (!itens || itens.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      if (Array.isArray(page?.posts)) return page.posts;
      if (Array.isArray(page?.dados?.posts)) return page.dados.posts;
      const dados = page.dados ?? page;
      const arr = Array.isArray(dados) ? dados : (Array.isArray(dados?.itens) ? dados.itens : []);
      return Array.isArray(arr) ? arr : [];
    }),
    keepPreviousData: true,
    enabled: (() => {
      if (!params) return false;
      const p = params;
      if (p.mode) {
        // require a non-empty q for mode-based searches
        return Boolean(p.q && String(p.q).trim().length > 0);
      }
      // fallback: check provided explicit filters
      return Boolean(p.palavraChave || p.hashtag || p.categoria || p.usuarioId || p.comunidadeId || (p.q && String(p.q).trim().length > 0));
    })(),
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao buscar posts';
      toast.error(msg);
    },
  });
}

export function useReplyComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ comentarioId, conteudo }) => postService.replyComment(comentarioId, conteudo),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
    onError: (err) => toast.error(err.response?.data?.mensagem || 'Erro ao responder comentário'),
  });
}

export function useCreateComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postService.createComment,
    onSuccess: (res, variables) => {
      const status = res?.status;
      const body = res?.data ?? res;
      if (status === 201 || body?.sucesso) {
        qc.invalidateQueries({ queryKey: ['comments', variables.postId] });
        qc.invalidateQueries({ queryKey: ['post', variables.postId] });
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['explore'] });
        toast.success(body?.mensagem || 'Comentário criado');
      }
    },
    onError: (err) => toast.error(err.response?.data?.mensagem || 'Erro ao comentar'),
  });
}

export function useDeleteComment(postId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postService.deleteComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', postId] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Comentário removido');
    },
    onError: (err) => toast.error(err.response?.data?.mensagem || 'Erro ao remover comentário'),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, conteudo }) => postService.update(postId, conteudo),
    onSuccess: (data, { postId }) => {
      if (data.sucesso !== false) {
        qc.invalidateQueries({ queryKey: ['post', postId] });
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['explore'] });
        qc.invalidateQueries({ queryKey: ['userPosts'] });
        toast.success('Post atualizado!');
      } else {
        toast.error(data.mensagem || 'Erro ao atualizar');
      }
    },
    onError: (err) => toast.error(err.response?.data?.mensagem || 'Erro ao atualizar post'),
  });
}

export function useToggleCommentLike(postId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ comentarioId, isLiked }) =>
      isLiked ? postService.unlikeComment(comentarioId) : postService.likeComment(comentarioId),

    onMutate: async ({ comentarioId, isLiked }) => {
      await qc.cancelQueries({ queryKey: ['comments', postId] });

      const previous = qc.getQueryData(['comments', postId]);

      qc.setQueryData(['comments', postId], (old) => {
        if (!old) return old;
        const comentarios = old.dados || old;
        if (!Array.isArray(comentarios)) return old;
        const updated = comentarios.map((c) =>
          c.id === comentarioId
            ? { ...c, curtiuUsuario: !isLiked, totalCurtidas: (c.totalCurtidas || 0) + (isLiked ? -1 : 1) }
            : c
        );
        return old.dados ? { ...old, dados: updated } : updated;
      });

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['comments', postId], context.previous);
      }
      const msg = error?.response?.data?.mensagem || 'Erro ao curtir comentário';
      if (msg) toast.error(msg);
    },
  });
}

export function useToggleSave() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isSaved }) => (isSaved ? postService.unsave(postId) : postService.save(postId)),

    onMutate: async ({ postId, isSaved }) => {
      const keys = [['feed'], ['explore'], ['communityFeed'], ['searchFeed'], ['post', postId], ['userPosts'], ['savedPosts']];

      // cancel and snapshot previous values for rollback
      const previous = {};
      for (const k of keys) {
        await qc.cancelQueries({ queryKey: k });
        previous[JSON.stringify(k)] = qc.getQueryData(k);
      }

      const updatePost = (post) => {
        if (post.id !== postId) return post;
        return { ...post, salvoUsuario: !isSaved };
      };

      // Update the single post cache
      qc.setQueryData(['post', postId], (old) => {
        if (!old?.dados) return old;
        return { ...old, dados: updatePost(old.dados) };
      });

      // Helper to map pages and update the post inside lists
      const mapPagesUpdate = (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            dados: Array.isArray(page.dados)
              ? page.dados.map(updatePost)
              : page.dados?.itens
                ? { ...page.dados, itens: page.dados.itens.map(updatePost) }
                : page.dados,
          })),
        };
      };

      // Update main list caches
      qc.setQueriesData({ queryKey: ['feed'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['explore'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['communityFeed'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['searchFeed'] }, mapPagesUpdate);
      qc.setQueriesData({ queryKey: ['userPosts'] }, mapPagesUpdate);

      // Optimistically update savedPosts: remove when unsaving, prepend when saving
      qc.setQueriesData({ queryKey: ['savedPosts'] }, (old) => {
        if (!old?.pages) return old;
        const pages = old.pages.map((p) => ({ ...p }));
        // If currently saved and user is unsaving -> remove from lists
        if (isSaved) {
          pages.forEach((pg) => {
            const d = pg.dados;
            if (Array.isArray(d)) pg.dados = d.filter((it) => it.id !== postId);
            else if (d && d.itens) pg.dados = { ...d, itens: d.itens.filter((it) => it.id !== postId) };
          });
          return { ...old, pages };
        }

        // If currently not saved and user is saving -> prepend to first page
        const first = pages[0];
        if (!first) return old;
        const d = first.dados;
        const newPostPlaceholder = { id: postId, salvoUsuario: true };
        if (Array.isArray(d)) {
          pages[0] = { ...first, dados: [newPostPlaceholder, ...d.filter((it) => it.id !== postId)] };
        } else if (d && d.itens) {
          pages[0] = { ...first, dados: { ...d, itens: [newPostPlaceholder, ...d.itens.filter((it) => it.id !== postId)] } };
        }
        return { ...old, pages };
      });
      return { previous };
    },

    onError: (err, _vars, context) => {
      if (context?.previous) {
        for (const keyStr of Object.keys(context.previous)) {
          try {
            const key = JSON.parse(keyStr);
            qc.setQueryData(key, context.previous[keyStr]);
          } catch (e) {
            // ignore
          }
        }
      } else {
        qc.invalidateQueries({ queryKey: ['post'] });
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['explore'] });
        qc.invalidateQueries({ queryKey: ['communityFeed'] });
        qc.invalidateQueries({ queryKey: ['userPosts'] });
        qc.invalidateQueries({ queryKey: ['savedPosts'] });
      }

      const msg = err?.response?.data?.mensagem || 'Erro ao salvar post';
      toast.error(msg);
    },
    onSuccess: (data, vars) => {
      // Prefer backend mensagem when available
      const msg = data?.mensagem || (vars.isSaved ? 'Removido dos salvos' : 'Salvo');
      toast.success(msg);

      // If backend returned updated post data, update caches accordingly
      const returned = data?.dados || data?.post || data;
      const updatePostInPages = (postObj) => {
        if (!postObj?.id) return;
        const update = (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              dados: Array.isArray(page.dados)
                ? page.dados.map((p) => (p.id === postObj.id ? postObj : p))
                : page.dados?.itens
                  ? { ...page.dados, itens: page.dados.itens.map((p) => (p.id === postObj.id ? postObj : p)) }
                  : page.dados,
            })),
          };
        };

        qc.setQueriesData({ queryKey: ['feed'] }, update);
        qc.setQueriesData({ queryKey: ['explore'] }, update);
        qc.setQueriesData({ queryKey: ['searchFeed'] }, update);
        qc.setQueriesData({ queryKey: ['communityFeed'] }, update);
        qc.setQueriesData({ queryKey: ['userPosts'] }, update);
        qc.setQueryData(['post', postObj.id], (old) => (old ? { ...old, dados: postObj } : { dados: postObj }));
      };

      if (returned && typeof returned === 'object') updatePostInPages(returned);

      // ensure savedPosts is refetched to reflect server truth
      qc.invalidateQueries({ queryKey: ['savedPosts'] });
    },
  });
}

export function useShare() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, comentario }) => postService.share(postId, comentario),
    onSuccess: async (data, vars) => {
      qc.invalidateQueries({ queryKey: ['post', vars.postId] });

      // If backend returned the created/shared post, extract it. Otherwise try to find an id and fetch the post.
      const extractPost = (resp) => {
        if (!resp) return null;
        if (resp.dados && typeof resp.dados === 'object' && resp.dados.id) return resp.dados;
        if (resp.share && resp.share.dados && resp.share.dados.id) return resp.share.dados;
        if (resp.share && typeof resp.share === 'object' && resp.share.id) return resp.share;
        if (typeof resp === 'object' && resp.id) return resp;
        return null;
      };

      let newPost = extractPost(data);

      // If no post object returned, look for an id candidate in known locations and fetch the post by id
      if (!newPost) {
        const idCandidate = data?.dados?.id || data?.id || data?.share?.id || data?.share?.dados?.id || data?.shareId || data?.share?.shareId;
        if (idCandidate) {
          try {
            const resp = await postService.getById(idCandidate);
            newPost = resp?.dados || resp;
          } catch (e) {
            // ignore fetch error and fallback to invalidation below
          }
        }
      }

      if (newPost) {
        const prependToInfinite = (key) => {
          qc.setQueryData({ queryKey: key }, (old) => {
            if (!old?.pages) return old;
            const pages = old.pages.map((p) => ({ ...p }));
            const first = pages[0];
            if (!first) return old;
            const d = first.dados;
            if (Array.isArray(d)) {
              pages[0] = { ...first, dados: [newPost, ...d.filter((it) => it.id !== newPost.id)] };
            } else if (d && d.itens) {
              pages[0] = { ...first, dados: { ...d, itens: [newPost, ...d.itens.filter((it) => it.id !== newPost.id)] } };
            }
            return { ...old, pages };
          });
        };

        // Prepend to relevant caches and cache the post individually
        prependToInfinite(['feed']);
        prependToInfinite(['explore']);
        prependToInfinite(['searchFeed']);
        prependToInfinite(['communityFeed']);
        if (newPost.id) qc.setQueryData(['post', newPost.id], { dados: newPost });
      } else {
        // fallback: invalidate feed so it refetches
        qc.invalidateQueries({ queryKey: ['feed'] });
      }

      // Prefer backend mensagem when available
      const msg = data?.mensagem || 'Post compartilhado';
      toast.success(msg);
    },
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao compartilhar';
      toast.error(msg);
    },
  });
}
