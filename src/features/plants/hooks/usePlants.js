import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { plantService } from '../services/plantService';

function unwrapRecommendationResponse(data) {
  // Backend returns wrapper {sucesso, dados: {sucesso, dados, mensagem}}
  if (!data) return null;
  if (data?.dados?.dados?.nomeComum) return data.dados.dados;
  if (data?.dados?.nomeComum) return data.dados;
  if (data?.nomeComum) return data;
  return null;
}

function displayServerMessageAsToast(data, fallbackMessage, fallbackIsError = false) {
  const msg = data?.mensagem || null;
  if (!msg) {
    if (fallbackMessage) {
      if (fallbackIsError) toast.error(fallbackMessage);
      else toast.success(fallbackMessage);
    }
    return;
  }

  const lowered = msg.toLowerCase();
  const positive = /sucesso|identificad|criada|adicionad|salvo|atualizad|removida|removido|adicionou/i;

  if (positive.test(lowered)) {
    toast.success(msg);
  } else {
    toast.error(msg);
  }
}

export function useMyPlants(pagina = 1) {
  return useQuery({
    queryKey: ['myPlants', pagina],
    queryFn: () => plantService.getMyPlants(pagina),
    // Normalize backend wrapped responses `{sucesso,dados,meta}` to UI pagination shape
    select: (data) => {
      if (!data) return data;
      // If backend returns wrapper { sucesso, dados: [...], meta: {...} }
      if (data.sucesso && Array.isArray(data.dados)) {
        const itens = data.dados;
        const meta = data.meta || {};
        return {
          itens,
          pagina: meta.pagina ?? 1,
          tamanho: meta.tamanho ?? itens.length,
          total: meta.total ?? itens.length,
          totalPaginas: meta.totalPaginas ?? 1,
          temProxima: meta.temProxima ?? false,
          temAnterior: meta.temAnterior ?? false,
        };
      }

      // If already in UI pagination shape, return as-is
      return data;
    },
    keepPreviousData: true,
  });
}

export function usePlantDetail(plantaId) {
  return useQuery({
    queryKey: ['plant', plantaId],
    queryFn: () => plantService.getById(plantaId),
    select: (data) => data?.dados ?? data,
    enabled: !!plantaId,
  });
}

export function useIdentifyPlant() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload) => plantService.identify(payload.file ?? payload, payload.comentario, payload.criarPostagem),
    onSuccess: (data) => {
      if (data?.sucesso && data.dados?.id) {
        toast.success('Planta identificada!');
        navigate(`/planta/${data.dados.id}`);
      } else if (data?.dados && (data.dados.id || data.dados.plantaId)) {
        // some backends return nested object without top-level sucesso flag
        toast.success(data.mensagem || 'Planta identificada!');
        const tryGetId = (obj) => obj.id || obj.plantaId || (obj.planta && obj.planta.id) || null;
        const nid = tryGetId(data.dados);
        if (nid) navigate(`/planta/${nid}`);
      } else {
        displayServerMessageAsToast(data, 'Não foi possível identificar a planta');
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

export function useSearchMyPlants(termo, pagina = 1) {
  return useQuery({
    queryKey: ['myPlantsSearch', termo, pagina],
    queryFn: () => plantService.searchMyPlants(termo, pagina),
    enabled: !!termo && termo.trim().length > 0,
    select: (data) => {
      if (!data) return data;
      if (data.sucesso && Array.isArray(data.dados)) {
        const itens = data.dados;
        const meta = data.meta || {};
        return {
          itens,
          pagina: meta.pagina ?? 1,
          tamanho: meta.tamanho ?? itens.length,
          total: meta.total ?? itens.length,
          totalPaginas: meta.totalPaginas ?? 1,
          temProxima: meta.temProxima ?? false,
          temAnterior: meta.temAnterior ?? false,
        };
      }
      return data;
    },
    keepPreviousData: true,
  });
}

export function useAddPlantFromSearch() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: plantService.addFromSearch,
    onSuccess: (data) => {
      if (data?.sucesso && data.dados?.id) {
        toast.success('Planta adicionada!');
        qc.invalidateQueries({ queryKey: ['myPlants'] });
        navigate(`/planta/${data.dados.id}`);
      } else if (data?.dados && (data.dados.id || data.dados.plantaId)) {
        toast.success(data.mensagem || 'Planta adicionada!');
        qc.invalidateQueries({ queryKey: ['myPlants'] });
        const id = data.dados.id || data.dados.plantaId || (data.dados.planta && data.dados.planta.id);
        if (id) navigate(`/planta/${id}`);
      } else {
        displayServerMessageAsToast(data, 'Erro ao adicionar planta');
      }
    },
    onError: (err) => {
      const serverData = err.response?.data;
      if (serverData) {
        displayServerMessageAsToast(serverData, 'Erro ao adicionar planta');
      } else {
        const msg = err.message || 'Erro ao adicionar planta';
        toast.error(msg);
      }
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


export function useRecommendPlant() {
  return useMutation({
    mutationFn: (payload) => plantService.recommend(payload),
    onSuccess: (data) => {
      const recommendation = unwrapRecommendationResponse(data);
      const serverMessage = data?.dados?.mensagem || data?.mensagem || null;

      if (recommendation?.nomeComum) {
        toast.success(serverMessage || 'Recomendação gerada!');
      } else {
        displayServerMessageAsToast(data?.dados || data, 'Não foi possível gerar recomendação');
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.dados?.mensagem
        || err.response?.data?.mensagem
        || 'Erro ao gerar recomendação';
      toast.error(msg);
    },
  });
}
