import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { eventsService } from '../services/eventService';

function mapEvent(event) {
  return {
    id: event.id,
    title: event.titulo,
    description: event.descricao,
    date: event.dataInicio,
    location: event.localizacao,
  };
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const data = await eventsService.getAll();
      return data.map(mapEvent);
    },
  });
}

export function useEvent(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const data = await eventsService.getById(id);
      return mapEvent(data);
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsService.create,
    onSuccess: () => {
      toast.success('Evento criado com sucesso!');
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eventsService.update(id, data),
    onSuccess: () => {
      toast.success('Evento atualizado com sucesso!');
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsService.delete,
    onSuccess: () => {
      toast.success('Evento removido com sucesso!');
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsService.join,
    onSuccess: () => {
      toast.success('Participação confirmada!');
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useLeaveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsService.leave,
    onSuccess: () => {
      toast.success('Você saiu do evento');
      queryClient.invalidateQueries(['events']);
    },
  });
}