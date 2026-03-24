import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { comunidadeService } from '../services/comunidadeService';

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
  const positive = /sucesso|criada|criado|entrar|entrando|entrou|salvo|atualizad|removida|removido|adicionou|publicad|publicou/i;

  if (positive.test(lowered)) {
    toast.success(msg);
  } else {
    toast.error(msg);
  }
}

export function useComunidades(pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['comunidades', pagina, tamanho],
    queryFn: () => comunidadeService.getAll(pagina, tamanho),
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
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar comunidades';
      toast.error(msg);
    },
  });
}

export function useComunidadeById(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade', comunidadeId],
    queryFn: () => comunidadeService.getById(comunidadeId),
    select: (data) => data?.dados ?? data,
    enabled: !!comunidadeId,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar comunidade';
      toast.error(msg);
    },
  });
}

export function useMinhasComunidades(pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['minhas-comunidades', pagina, tamanho],
    queryFn: () => comunidadeService.getMinhas(pagina, tamanho),
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
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar suas comunidades';
      toast.error(msg);
    },
  });
}

export function useBuscarComunidades(termo) {
  return useQuery({
    queryKey: ['buscar-comunidades', termo],
    queryFn: () => comunidadeService.buscar(termo),
    enabled: !!termo?.trim(),
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
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao buscar comunidades';
      toast.error(msg);
    },
  });
}

export function useComunidadePosts(comunidadeId, pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['comunidade-posts', comunidadeId, pagina, tamanho],
    queryFn: () => comunidadeService.getPosts(comunidadeId, pagina, tamanho),
    enabled: !!comunidadeId,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar posts da comunidade';
      toast.error(msg);
    },
  });
}

export function useCreateComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      displayServerMessageAsToast(data, 'Comunidade criada com sucesso');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao criar comunidade';
      toast.error(msg);
    },
  });
}

export function useUpdateComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comunidadeId, payload }) =>
      comunidadeService.update(comunidadeId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
      displayServerMessageAsToast(data, 'Comunidade atualizada');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao atualizar comunidade';
      toast.error(msg);
    },
  });
}

export function useJoinComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.entrar,
    onSuccess: (data, comunidadeId) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      // Invalidate the specific comunidade cache if we know the id
      if (comunidadeId) {
        queryClient.invalidateQueries({ queryKey: ['comunidade', comunidadeId] });
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts', comunidadeId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts'] });
      }
      displayServerMessageAsToast(data, 'Entrou na comunidade');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao entrar na comunidade';
      toast.error(msg);
    },
  });
}

export function useDeleteComunidade() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: comunidadeService.delete,
    onSuccess: (data, comunidadeId) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade', comunidadeId] });
      queryClient.invalidateQueries({ queryKey: ['comunidade-membros', comunidadeId] });
      displayServerMessageAsToast(data, 'Comunidade removida');
      // navigate back to list after deletion
      try {
        navigate('/comunidades');
      } catch (e) {
        // ignore if navigation not available
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao remover comunidade';
      toast.error(msg);
    },
  });
}

export function useLeaveComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.sair,
    onSuccess: (data, comunidadeId) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      if (comunidadeId) {
        queryClient.invalidateQueries({ queryKey: ['comunidade', comunidadeId] });
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts', comunidadeId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comunidade-posts'] });
      }
      displayServerMessageAsToast(data, 'Saiu da comunidade');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao sair da comunidade';
      toast.error(msg);
    },
  });
}

export function useRecomendadas(quantidade = 10) {
  return useQuery({
    queryKey: ['comunidade-recomendadas', quantidade],
    queryFn: () => comunidadeService.recomendadas(quantidade),
    select: (data) => data?.dados ?? data,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar comunidades recomendadas';
      toast.error(msg);
    },
  });
}

export function useComunidadesByUsuario(usuarioId, pagina = 1, tamanho = 10) {
  return useQuery({
    queryKey: ['comunidades-usuario', usuarioId, pagina, tamanho],
    queryFn: () => comunidadeService.getByUsuario(usuarioId, pagina, tamanho),
    enabled: !!usuarioId,
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
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar comunidades do usuário';
      toast.error(msg);
    },
  });
}

export function useMembros(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade-membros', comunidadeId],
    queryFn: () => comunidadeService.getMembros(comunidadeId),
    enabled: !!comunidadeId,
    select: (data) => data?.dados ?? data,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar membros da comunidade';
      toast.error(msg);
    },
  });
}

export function useAdmins(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade-admins', comunidadeId],
    queryFn: () => comunidadeService.getAdmins(comunidadeId),
    enabled: !!comunidadeId,
    select: (data) => data?.dados ?? data,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar admins da comunidade';
      toast.error(msg);
    },
  });
}

export function useSouMembro(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade-sou-membro', comunidadeId],
    queryFn: () => comunidadeService.souMembro(comunidadeId),
    enabled: !!comunidadeId,
    select: (data) => data?.dados ?? data,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao verificar associação à comunidade';
      toast.error(msg);
    },
  });
}

export function useSolicitarEntrada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: comunidadeService.solicitarEntrada,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      displayServerMessageAsToast(data, 'Solicitação enviada');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao solicitar entrada';
      toast.error(msg);
    },
  });
}

export function useSolicitacoes(comunidadeId) {
  return useQuery({
    queryKey: ['comunidade-solicitacoes', comunidadeId],
    queryFn: () => comunidadeService.solicitacoes(comunidadeId),
    enabled: !!comunidadeId,
    select: (data) => data?.dados ?? data,
    onError: (err) => {
      const msg = err?.response?.data?.mensagem || 'Erro ao carregar solicitações';
      toast.error(msg);
    },
  });
}

export function useAprovarSolicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comunidadeId, usuarioId }) =>
      comunidadeService.aprovarSolicitacao(comunidadeId, usuarioId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comunidade-solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['comunidade-membros'] });
      displayServerMessageAsToast(data, 'Solicitação aprovada');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao aprovar solicitação';
      toast.error(msg);
    },
  });
}

export function useExpulsar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comunidadeId, usuarioId }) =>
      comunidadeService.expulsar(comunidadeId, usuarioId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comunidade-membros'] });
      displayServerMessageAsToast(data, 'Usuário expulso');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao expulsar usuário';
      toast.error(msg);
    },
  });
}

export function useTransferirAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comunidadeId, novoAdminId }) =>
      comunidadeService.transferirAdmin(comunidadeId, novoAdminId),
    onSuccess: (data, variables) => {
      // Determine comunidade id from variables or server response
      const comunidadeId = variables?.comunidadeId ?? data?.dados?.id ?? data?.id;
      // Refresh comunidade metadata, membros and admins so UI reflects new ownership
      queryClient.invalidateQueries({ queryKey: ['comunidade-admins', comunidadeId] });
      queryClient.invalidateQueries({ queryKey: ['comunidade', comunidadeId] });
      queryClient.invalidateQueries({ queryKey: ['comunidade-membros', comunidadeId] });
      queryClient.invalidateQueries({ queryKey: ['minhas-comunidades'] });
      queryClient.invalidateQueries({ queryKey: ['comunidades'] });
      displayServerMessageAsToast(data, 'Admin transferido');
    },
    onError: (err) => {
      const msg = err.response?.data?.mensagem || 'Erro ao transferir admin';
      toast.error(msg);
    },
  });
}