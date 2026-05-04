import { useQuery } from '@tanstack/react-query';
import { comunidadeService } from '../../comunidade/services/comunidadeService';
import { discoveryService } from '../services/discoveryService';

export function useGlobalSearch(termo) {
  return useQuery({
    queryKey: ['globalSearch', termo],
    queryFn: () => discoveryService.search(termo),
    select: (data) => ({
      usuarios: data?.usuarios || [],
      posts: data?.posts || [],
      comunidades: data?.comunidades || [],
      plantas: data?.plantas || [],
    }),
    enabled: Boolean(termo?.trim()),
  });
}

export function useUserQuickSearch(nome) {
  return useQuery({
    queryKey: ['userQuickSearch', nome],
    queryFn: () => discoveryService.searchUsers(nome),
    select: (data) => data?.usuarios || [],
    enabled: Boolean(nome?.trim()),
  });
}

export function useTrendingPosts() {
  return useQuery({
    queryKey: ['trendingPosts'],
    queryFn: () => discoveryService.getTrendingPosts(),
    select: (data) => data?.dados || data || [],
  });
}

export function useSuggestedUsers() {
  return useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: () => discoveryService.getUserSuggestions(),
    select: (data) => data?.dados || data || [],
  });
}

export function useRecommendedCommunities() {
  return useQuery({
    queryKey: ['recommendedCommunities'],
    queryFn: () => comunidadeService.recomendadas(8),
    select: (data) => data?.dados || data || [],
  });
}
