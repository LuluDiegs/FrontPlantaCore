import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comunidadeService } from '../services/comunidadeService';

export function useComunidades(pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['comunidades', pagina, tamanho],
    queryFn: () => comunidadeService.getAll(pagina, tamanho),
  });
}

export function useComunidadeById(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade', comunidadeId],
    queryFn: () => comunidadeService.getById(comunidadeId),
    enabled: !!comunidadeId,
  });
}

export function useMinhasComunidades() {
  return useQuery({
    queryKey: ['minhas-comunidades'],
    queryFn: () => comunidadeService.getMinhas(),
  });
}

export function useBuscarComunidades(termo) {
  return useQuery({
    queryKey: ['buscar-comunidades', termo],
    queryFn: () => comunidadeService.buscar(termo),
    enabled: !!termo?.trim(),
  });
}

export function useComunidadePosts(comunidadeId, pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['comunidade-posts', comunidadeId, pagina, tamanho],
    queryFn: () => comunidadeService.getPosts(comunidadeId, pagina, tamanho),
    enabled: !!comunidadeId,
  });
}

export function useCreateComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
    },
  });
}

export function useJoinComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.entrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade-posts'] });
    },
  });
}

export function useDeleteComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
    },
  });
}

export function useLeaveComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.sair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade-posts'] });
    },
  });
}