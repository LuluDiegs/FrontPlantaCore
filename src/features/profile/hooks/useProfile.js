import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileService } from '../services/profileService';
import { useAuthStore } from '../../auth/stores/authStore';

export function useMyProfile() {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: profileService.getMyProfile,
    select: (data) => data.dados,
  });
}

export function usePublicProfile(usuarioId) {
  return useQuery({
    queryKey: ['publicProfile', usuarioId],
    queryFn: () => profileService.getPublicProfile(usuarioId),
    select: (data) => data.dados,
    enabled: !!usuarioId,
  });
}

export function useFollowers(usuarioId, pagina = 1) {
  return useQuery({
    queryKey: ['followers', usuarioId, pagina],
    queryFn: () => profileService.getFollowers(usuarioId, pagina),
    select: (data) => data.dados,
    enabled: !!usuarioId,
  });
}

export function useFollowing(usuarioId, pagina = 1) {
  return useQuery({
    queryKey: ['following', usuarioId, pagina],
    queryFn: () => profileService.getFollowing(usuarioId, pagina),
    select: (data) => data.dados,
    enabled: !!usuarioId,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async ({ nome, biografia, privado }) => {
      const results = [];
      if (nome !== undefined) results.push(await profileService.updateName(nome));
      if (biografia !== undefined) results.push(await profileService.updateBio(biografia));
      if (privado !== undefined) results.push(await profileService.updatePrivacy(privado));
      return results;
    },
    onSuccess: (_, variables) => {
      if (variables.nome) updateUser({ nome: variables.nome });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Perfil atualizado');
    },
    onError: () => toast.error('Erro ao atualizar perfil'),
  });
}

export function useUploadProfilePhoto() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: profileService.uploadProfilePhoto,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Foto atualizada');
    },
    onError: () => toast.error('Erro ao enviar foto'),
  });
}

export function useUpdatePrivacy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ privado }) => profileService.updatePrivacy(privado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Configuração de privacidade atualizada');
    },
    onError: () => toast.error('Erro ao atualizar privacidade'),
  });
}

export function useToggleFollow() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ usuarioId, isFollowing }) =>
      isFollowing
        ? profileService.unfollow(usuarioId)
        : profileService.follow(usuarioId),

    onMutate: async ({ usuarioId, isFollowing }) => {
      await qc.cancelQueries({ queryKey: ['publicProfile', usuarioId] });

      const previous = qc.getQueryData(['publicProfile', usuarioId]);

      qc.setQueryData(['publicProfile', usuarioId], (old) => {
        if (!old?.dados) return old;
        return {
          ...old,
          dados: {
            ...old.dados,
            userSegueEste: !isFollowing,
            totalSeguidores: old.dados.totalSeguidores + (isFollowing ? -1 : 1),
          },
        };
      });

      return { previous };
    },

    onError: (_err, { usuarioId }, context) => {
      if (context?.previous) {
        qc.setQueryData(['publicProfile', usuarioId], context.previous);
      }
      toast.error('Erro ao atualizar');
    },

    onSettled: (_data, _err, { usuarioId }) => {
      qc.invalidateQueries({ queryKey: ['publicProfile', usuarioId] });
      qc.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useRequestFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alvoId) => profileService.requestFollow(alvoId),
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
    queryFn: profileService.getFollowRequests,
    select: (d) => d.dados || d,
  });
}

export function useAcceptSolicitacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (solicitacaoId) => profileService.acceptFollowRequest(solicitacaoId),
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
    mutationFn: (solicitacaoId) => profileService.rejectFollowRequest(solicitacaoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['followRequests'] });
      toast.success('Solicitação rejeitada');
    },
    onError: () => toast.error('Erro ao rejeitar solicitação'),
  });
}
