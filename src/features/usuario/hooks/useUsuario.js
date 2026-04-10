import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usuarioService } from '../services/usuarioService';

export function useMyProfile() {
  return useQuery({ queryKey: ['myProfile'], queryFn: usuarioService.getProfile, select: (data) => data.dados });
}

export function usePublicProfile(usuarioId) {
  return useQuery({ queryKey: ['publicProfile', usuarioId], queryFn: () => usuarioService.getPublicProfile(usuarioId), select: (data) => data.dados, enabled: !!usuarioId });
}

export function useUpdateName() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ novoNome }) => usuarioService.updateName(novoNome),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Nome atualizado');
    },
    onError: () => toast.error('Erro ao atualizar nome'),
  });
}

export function useUpdateBio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ biografia }) => usuarioService.updateBio(biografia),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Biografia atualizada');
    },
    onError: () => toast.error('Erro ao atualizar biografia'),
  });
}

export function useUpdatePrivacy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ privado }) => usuarioService.updatePrivacy(privado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Configurações de privacidade atualizadas');
    },
    onError: () => toast.error('Erro ao alterar privacidade'),
  });
}

export function useUploadProfilePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file) => usuarioService.uploadProfilePhoto(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Foto de perfil atualizada');
    },
    onError: () => toast.error('Erro ao enviar foto'),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => usuarioService.deleteAccount(),
    onSuccess: () => {
      toast.success('Conta excluída');
      // on success, backend likely clears tokens; leave redirect to caller
    },
    onError: () => toast.error('Erro ao excluir conta'),
  });
}

export function useFollowToggle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ usuarioId, isFollowing }) => (isFollowing ? usuarioService.unfollow(usuarioId) : usuarioService.follow(usuarioId)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['publicProfile', vars.usuarioId] });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: () => toast.error('Erro ao seguir/desseguir'),
  });
}

export function useRequestFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alvoId) => usuarioService.requestFollow(alvoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publicProfile'] });
      toast.success('Solicitação enviada');
    },
    onError: () => toast.error('Erro ao enviar solicitação'),
  });
}

export function useSolicitacoes() {
  return useQuery({
    queryKey: ['followRequests'],
    queryFn: usuarioService.getFollowRequests,
    select: (d) => d.dados || d,
  });
}

export function useAcceptSolicitacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (solicitacaoId) => usuarioService.acceptFollowRequest(solicitacaoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['followRequests'] });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Solicitação aceita');
    },
    onError: () => toast.error('Erro ao aceitar solicitação'),
  });
}

export function useRejectSolicitacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (solicitacaoId) => usuarioService.rejectFollowRequest(solicitacaoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['followRequests'] });
      toast.success('Solicitação rejeitada');
    },
    onError: () => toast.error('Erro ao rejeitar solicitação'),
  });
}

export function useFollowers(usuarioId) {
  return useInfiniteQuery({
    queryKey: ['followers', usuarioId],
    queryFn: ({ pageParam = 1 }) => usuarioService.getFollowers(usuarioId, pageParam),
    enabled: !!usuarioId,
    getNextPageParam: (lastPage, all) => (lastPage?.temProxima ? all.length + 1 : undefined),
    select: (data) => data.pages.flatMap((p) => p.dados || []),
  });
}

export function useFollowing(usuarioId) {
  return useInfiniteQuery({
    queryKey: ['following', usuarioId],
    queryFn: ({ pageParam = 1 }) => usuarioService.getFollowing(usuarioId, pageParam),
    enabled: !!usuarioId,
    getNextPageParam: (lastPage, all) => (lastPage?.temProxima ? all.length + 1 : undefined),
    select: (data) => data.pages.flatMap((p) => p.dados || []),
  });
}

export function useUserPlants(usuarioId) {
  return useInfiniteQuery({
    queryKey: ['userPlants', usuarioId],
    queryFn: ({ pageParam = 1 }) => usuarioService.getUserPlants(usuarioId, pageParam),
    enabled: !!usuarioId,
    getNextPageParam: (lastPage, all) => (lastPage?.temProxima ? all.length + 1 : undefined),
    select: (data) => data.pages.flatMap((p) => p.dados?.itens || p.dados || []),
  });
}

export function useUserPosts(usuarioId) {
  return useInfiniteQuery({
    queryKey: ['userPosts', usuarioId],
    queryFn: ({ pageParam = 1 }) => usuarioService.getUserPosts(usuarioId, pageParam),
    enabled: !!usuarioId,
    getNextPageParam: (lastPage, all) => (lastPage?.temProxima ? all.length + 1 : undefined),
    select: (data) => data.pages.flatMap((p) => p.dados?.itens || p.dados || []),
  });
}

export function useSavedPosts() {
  return useInfiniteQuery({
    queryKey: ['savedPosts'],
    queryFn: ({ pageParam = 1 }) => usuarioService.getSavedPosts(pageParam),
    getNextPageParam: (lastPage, all) => (lastPage?.temProxima ? all.length + 1 : undefined),
    select: (data) => data.pages.flatMap((p) => p.dados?.itens || p.dados || []),
  });
}

// Reactivation helpers
export function useRequestReactivate() {
  return useMutation({ mutationFn: (email) => usuarioService.requestReactivate(email) });
}

export function useConfirmReactivate() {
  return useMutation({ mutationFn: (data) => usuarioService.confirmReactivate(data) });
}

export function useVerifyReactivate() {
  return useMutation({ mutationFn: (data) => usuarioService.verifyReactivateToken(data) });
}

export function useResetReactivate() {
  return useMutation({ mutationFn: (data) => usuarioService.resetReactivate(data) });
}

export default {};
