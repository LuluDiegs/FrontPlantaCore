import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { notificationService } from '../services/notificationService';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
    select: (data) => {
      // Backend retorna: notificacoesSociais, lembretes, totalNaoLidas
      const notificacoesSociais = data.dados?.notificacoesSociais || [];
      const lembretes = data.dados?.lembretes || [];
      const all = [...notificacoesSociais, ...lembretes];

      return {
        notifications: all,
        notificacoesSociais,
        lembretes,
        unreadCount: data.dados?.totalNaoLidas || 0,
      };
    },
    retry: 1,
    refetchInterval: 30_000, // Auto-refetch a cada 30s
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
    select: (data) => data.dados?.totalNaoLidas || 0,
    refetchInterval: 60_000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (notificacaoId) => {
      await qc.cancelQueries({ queryKey: ['notifications'] });

      qc.setQueryData(['notifications'], (old) => {
        if (!old) return old;

        // Backend retorna notificacoesSociais e lembretes separadamente
        const notificacoesSociais = (old.notificacoesSociais || []).map((n) =>
          n.id === notificacaoId ? { ...n, lida: true } : n
        );

        const lembretes = (old.lembretes || []).map((n) =>
          n.id === notificacaoId ? { ...n, lida: true } : n
        );

        const allNotifs = [...notificacoesSociais, ...lembretes];
        const unreadCount = allNotifs.filter((n) => !n.lida).length;

        return {
          ...old,
          notificacoesSociais,
          lembretes,
          notifications: allNotifs,
          unreadCount,
        };
      });
    },
    onSuccess: () => {
      toast.success('Marcada como lida');
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.error('Erro ao marcar como lida');
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['notifications'] });

      qc.setQueryData(['notifications'], (old) => {
        if (!old) return old;

        const notificacoesSociais = (old.notificacoesSociais || []).map((n) => ({ ...n, lida: true }));
        const lembretes = (old.lembretes || []).map((n) => ({ ...n, lida: true }));
        const notifications = [...notificacoesSociais, ...lembretes];

        return {
          ...old,
          notificacoesSociais,
          lembretes,
          notifications,
          unreadCount: 0,
        };
      });
    },
    onSuccess: () => {
      toast.success('Todas marcadas como lidas');
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.error('Erro ao marcar notificações');
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationService.delete,
    onMutate: async (notificacaoId) => {
      await qc.cancelQueries({ queryKey: ['notifications'] });

      qc.setQueryData(['notifications'], (old) => {
        if (!old) return old;

        const notificacoesSociais = (old.notificacoesSociais || []).filter((n) => n.id !== notificacaoId);
        const lembretes = (old.lembretes || []).filter((n) => n.id !== notificacaoId);
        const notifications = [...notificacoesSociais, ...lembretes];
        const unreadCount = notifications.filter((n) => !n.lida).length;

        return {
          ...old,
          notificacoesSociais,
          lembretes,
          notifications,
          unreadCount,
        };
      });
    },
    onSuccess: () => {
      toast.success('Notificação removida');
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.error('Erro ao remover notificação');
    },
  });
}

export function useDeleteAllNotifications() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationService.deleteAll,
    onSuccess: () => {
      qc.setQueryData(['notifications'], {
        notifications: [],
        notificacoesSociais: [],
        lembretes: [],
        unreadCount: 0,
      });
      toast.success('Notificações removidas');
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.error('Erro ao remover notificações');
    },
  });
}
