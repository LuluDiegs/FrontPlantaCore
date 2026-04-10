import { QueryClient } from '@tanstack/react-query';
import { handleApiError } from './apiErrorHandler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        handleApiError(error);
      },
    },
  },
});
