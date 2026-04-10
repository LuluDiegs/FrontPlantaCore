import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventoService } from '../services/eventoService';
import { toast } from 'react-hot-toast';

export function useEventos() {
  return useQuery(['eventos'], () => eventoService.getAll());
}

export function useEvento(id) {
  return useQuery(['evento', id], () => eventoService.getById(id), { enabled: !!id });
}

export function useCreateEvento() {
  const qc = useQueryClient();
  return useMutation((data) => eventoService.create(data), {
    onSuccess: () => {
      qc.invalidateQueries(['eventos']);
      toast.success('Evento criado');
    },
  });
}

export function useUpdateEvento(eventoId) {
  const qc = useQueryClient();
  return useMutation((data) => eventoService.update(eventoId, data), {
    onSuccess: () => {
      qc.invalidateQueries(['evento', eventoId]);
      qc.invalidateQueries(['eventos']);
      toast.success('Evento atualizado');
    },
  });
}

export function useToggleParticipacao() {
  const qc = useQueryClient();
  return useMutation(({ eventoId, participar = true }) => (participar ? eventoService.markParticipacao(eventoId) : eventoService.unmarkParticipacao(eventoId)), {
    onSuccess: () => {
      qc.invalidateQueries(['eventos']);
      toast.success('Participação atualizada');
    },
  });
}

export function useDeleteEvento() {
  const qc = useQueryClient();
  return useMutation((eventoId) => eventoService.remove(eventoId), {
    onSuccess: () => {
      qc.invalidateQueries(['eventos']);
      toast.success('Evento removido');
    },
  });
}

export default useEventos;
