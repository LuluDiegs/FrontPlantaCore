import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';

export function useCreatePost(comunidadeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/Post', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidade-posts', comunidadeId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}