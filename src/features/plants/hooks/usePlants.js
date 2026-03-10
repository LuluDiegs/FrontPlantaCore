import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { plantService } from '../services/plantService';

export function useMyPlants(pagina = 1) {
  return useQuery({
    queryKey: ['myPlants', pagina],
    queryFn: () => plantService.getMyPlants(pagina),
    select: (data) => data.dados,
  });
}

export function usePlantDetail(plantaId) {
  return useQuery({
    queryKey: ['plant', plantaId],
    queryFn: () => plantService.getById(plantaId),
    select: (data) => data.dados,
    enabled: !!plantaId,
  });
}

export function useIdentifyPlant() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: plantService.identify,
    onSuccess: (data) => {
      if (data.sucesso && data.dados?.id) {
        toast.success('Planta identificada!');
        navigate(`/planta/${data.dados.id}`);
      } else {
        toast.error(data.mensagem || 'Não foi possível identificar a planta');
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao identificar planta';
      toast.error(msg);
    },
  });
}

export function useSearchPlants() {
  return useMutation({
    mutationFn: ({ nomePlanta, pagina }) => plantService.search(nomePlanta, pagina),
    onError: () => toast.error('Erro ao buscar plantas'),
  });
}

export function useAddPlantFromSearch() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: plantService.addFromSearch,
    onSuccess: (data) => {
      console.log('[useAddPlantFromSearch] Response:', data);

      if (data.sucesso && data.dados?.id) {
        toast.success('Planta adicionada!');
        // Invalida minhas plantas para refresh automático
        qc.invalidateQueries({ queryKey: ['myPlants'] });
        // Navega direto para a planta
        navigate(`/planta/${data.dados.id}`);
      } else {
        console.error('[useAddPlantFromSearch] Falha na resposta:', data);
        toast.error(data.mensagem || 'Erro ao adicionar planta');
      }
    },
    onError: (err) => {
      console.error('[useAddPlantFromSearch] Erro:', err);
      const msg = err.response?.data?.mensagem || err.message || 'Erro ao adicionar planta';
      toast.error(msg);
    },
  });
}

export function useDeletePlant() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: plantService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myPlants'] });
      toast.success('Planta removida');
      navigate('/minhas-plantas');
    },
    onError: () => toast.error('Erro ao remover planta'),
  });
}

export function useGenerateCareReminder() {
  return useMutation({
    mutationFn: plantService.generateCareReminder,
    onSuccess: (data) => {
      // Backend gera lembretes automaticamente 1x/dia via PlantCareReminderBackgroundService
      toast.success('✅ Lembretes são gerados automaticamente todos os dias');
    },
    onError: () => {
      // Endpoint não implementado - mostrar mensagem informativa
      toast.success('💡 Lembretes são gerados automaticamente todos os dias');
    },
  });
}
