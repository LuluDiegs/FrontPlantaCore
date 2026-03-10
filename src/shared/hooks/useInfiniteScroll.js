import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Hook para infinite scroll com IntersectionObserver.
 *
 * @param {object} options
 * @param {function} options.fetchNextPage - Função do useInfiniteQuery
 * @param {boolean} options.hasNextPage - Se há mais páginas
 * @param {boolean} options.isFetchingNextPage - Se está buscando a próxima
 *
 * @returns {{ ref: React.Ref }} - ref para anexar ao elemento sentinela
 *
 * Uso:
 * ```jsx
 * const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });
 * return <div ref={ref} /> // sentinela no final da lista
 * ```
 */
export default function useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px', // dispara 200px antes de chegar ao final
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref };
}
