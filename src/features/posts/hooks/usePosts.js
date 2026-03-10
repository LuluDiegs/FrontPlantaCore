import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => postService.getFeed(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const posts = lastPage.dados;
      if (!posts || posts.length < 10) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => page.dados || []),
  });
}

export function useExplore() {
  return useInfiniteQuery({
    queryKey: ['explore'],
    queryFn: ({ pageParam = 1 }) => postService.getExplore(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const data = lastPage.dados;
      if (!data?.temProxima) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const d = page.dados;
      return d?.itens || d || [];
    }),
  });
}

export function useUserPosts(usuarioId) {
  return useInfiniteQuery({
    queryKey: ['userPosts', usuarioId],
    queryFn: ({ pageParam = 1 }) => postService.getByUser(usuarioId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const data = lastPage.dados;
      if (!data?.temProxima) return undefined;
      return allPages.length + 1;
    },
    select: (data) => data.pages.flatMap((page) => {
      const d = page.dados;
      return d?.itens || d || [];
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
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: (data) => {
      if (data.sucesso) {
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['userPosts'] });
        qc.invalidateQueries({ queryKey: ['myProfile'] });
        toast.success('Post publicado!');
        navigate('/feed');
      } else {
        toast.error(data.mensagem || 'Erro ao publicar');
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['explore'] });
      qc.invalidateQueries({ queryKey: ['userPosts'] });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Post removido');
    },
    onError: () => toast.error('Erro ao remover post'),
  });
}

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }) =>
      isLiked ? postService.unlike(postId) : postService.like(postId),

    onMutate: async ({ postId, isLiked }) => {
      const queryKeys = [['feed'], ['explore'], ['post', postId]];

      for (const key of queryKeys) {
        await qc.cancelQueries({ queryKey: key });
      }

      const updatePost = (post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          curtiuUsuario: !isLiked,
          totalCurtidas: post.totalCurtidas + (isLiked ? -1 : 1),
        };
      };

      // Atualiza o cache do post individual
      qc.setQueryData(['post', postId], (old) => {
        if (!old?.dados) return old;
        return { ...old, dados: updatePost(old.dados) };
      });

      // Atualiza nas listas (feed, explore, userPosts)
      for (const key of [['feed'], ['explore']]) {
        qc.setQueriesData({ queryKey: key }, (old) => {
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
        });
      }

      // Atualiza posts no perfil do usuário
      qc.setQueriesData({ queryKey: ['userPosts'] }, (old) => {
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
      });
    },

    onError: (_err, { postId }) => {
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['explore'] });
      qc.invalidateQueries({ queryKey: ['userPosts'] });
      toast.error('Erro ao curtir');
    },
  });
}

export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postService.getComments(postId),
    select: (data) => data.dados || [],
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postService.createComment,
    onSuccess: (data, variables) => {
      if (data.sucesso) {
        qc.invalidateQueries({ queryKey: ['comments', variables.postId] });
        qc.invalidateQueries({ queryKey: ['post', variables.postId] });
        qc.invalidateQueries({ queryKey: ['feed'] });
        qc.invalidateQueries({ queryKey: ['explore'] });
      }
    },
    onError: () => toast.error('Erro ao comentar'),
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
    onError: () => toast.error('Erro ao remover comentário'),
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
    onError: () => toast.error('Erro ao atualizar post'),
  });
}

export function useToggleCommentLike(postId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ comentarioId, isLiked }) =>
      isLiked ? postService.unlikeComment(comentarioId) : postService.likeComment(comentarioId),

    onMutate: async ({ comentarioId, isLiked }) => {
      await qc.cancelQueries({ queryKey: ['comments', postId] });

      qc.setQueryData(['comments', postId], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((c) =>
          c.id === comentarioId
            ? { ...c, curtiuUsuario: !isLiked, totalCurtidas: (c.totalCurtidas || 0) + (isLiked ? -1 : 1) }
            : c
        );
      });
    },

    onError: (error) => {
      qc.invalidateQueries({ queryKey: ['comments', postId] });
      const status = error?.response?.status;
      // 400 pode significar estado já aplicado (já curtiu/já descurtiu) — apenas sincroniza silenciosamente
      if (status !== 400) {
        toast.error('Erro ao curtir comentário');
      }
    },
  });
}
