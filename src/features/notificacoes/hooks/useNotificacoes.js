// Hook para configurações de notificações
export function useConfiguracoesNotificacoes() {
  return useQuery(['notificacoes-configuracoes'], () => notificacaoService.configuracoes());
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificacaoService } from '../services/notificacaoService';
import { toast } from 'react-hot-toast';

export function useNotificacoes() {
  return useQuery(['notificacoes'], () => notificacaoService.list());
}

export function useNotificacoesNaoLidas() {
  return useQuery(['notificacoes', 'nao-lidas'], () => notificacaoService.listNaoLidas());
}

export function useMarcarComoLida() {
  const qc = useQueryClient();
  return useMutation((id) => notificacaoService.marcarComoLida(id), {
    onSuccess: () => {
      qc.invalidateQueries(['notificacoes']);
      qc.invalidateQueries(['notificacoes', 'nao-lidas']);
    },
  });
}

export function useMarcarTodasComoLidas() {
  const qc = useQueryClient();
  return useMutation(() => notificacaoService.marcarTodasComoLidas(), {
    onSuccess: () => {
      qc.invalidateQueries(['notificacoes']);
      qc.invalidateQueries(['notificacoes', 'nao-lidas']);
      toast.success('Todas notificações marcadas como lidas');
    },
  });
}

export function useDeleteNotificacao() {
  const qc = useQueryClient();
  return useMutation((id) => notificacaoService.remove(id), {
    onSuccess: () => {
      qc.invalidateQueries(['notificacoes']);
      qc.invalidateQueries(['notificacoes', 'nao-lidas']);
      toast.success('Notificação removida');
    },
  });
}

export function useDeleteAllNotificacoes() {
  const qc = useQueryClient();
  return useMutation(() => notificacaoService.removeAll(), {
    onSuccess: () => {
      qc.invalidateQueries(['notificacoes']);
      qc.invalidateQueries(['notificacoes', 'nao-lidas']);
      toast.success('Todas notificações removidas');
    },
  });
}

export default useNotificacoes;
