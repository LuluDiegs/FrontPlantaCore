import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { storeService } from '../services/storeService';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getAll,
    select: (data) => data?.dados || [],
  });
}

export function useMyStores() {
  return useQuery({
    queryKey: ['myStores'],
    queryFn: storeService.getMine,
    select: (data) => data?.dados || [],
  });
}

export function useStore(id) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storeService.getById(id),
    select: (data) => data?.dados || data,
    enabled: !!id,
  });
}

export function useCreateStore() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: storeService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['myStores'] });
      toast.success(data?.meta?.mensagem || 'Loja criada com sucesso');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.mensagem || 'Erro ao criar loja');
    },
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => storeService.update(id, payload),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['myStores'] });
      qc.invalidateQueries({ queryKey: ['store', variables.id] });
      toast.success(data?.meta?.mensagem || 'Loja atualizada com sucesso');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.mensagem || 'Erro ao atualizar loja');
    },
  });
}

export function useDeleteStore() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: storeService.remove,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['myStores'] });
      toast.success(data?.meta?.mensagem || 'Loja removida com sucesso');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.mensagem || 'Erro ao remover loja');
    },
  });
}
