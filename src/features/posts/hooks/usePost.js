import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

export function useCreatePost(comunidadeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return postService.create(payload);
    },
    onSuccess: (res, variables) => {
      // Invalidate the specific community caches
      if (comunidadeId || variables?.comunidadeId) {
        const id = comunidadeId ?? variables.comunidadeId;
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts', id] });
        queryClient.invalidateQueries({ queryKey: ['communityFeed', id] });
        queryClient.invalidateQueries({ queryKey: ['comunidade', id] });
      } else {
        // fallback: invalidate generic community posts list
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts'] });
      }

      toast.success('Post publicado na comunidade');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.mensagem || 'Erro ao publicar post na comunidade');
    },
  });
}