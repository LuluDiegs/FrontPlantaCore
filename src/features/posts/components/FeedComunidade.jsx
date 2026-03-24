import React, { useRef, useEffect, useState } from 'react';
import Spinner from '../../../shared/components/ui/Spinner';
import PostCard from './PostCard';
import { useCommunityFeed } from '../hooks/usePosts';
import { useDeletePost } from '../hooks/usePosts';
import styles from './FeedComunidade.module.css';

const ORDER_OPTIONS = [
  { value: 'mais_recente', label: 'Mais recente' },
  { value: 'mais_antigo', label: 'Mais antigo' },
  { value: 'mais_curtido', label: 'Mais curtido' },
  { value: 'mais_comentado', label: 'Mais comentado' },
];


export default function FeedComunidade({ comunidadeId, ordenarPor: initialOrdenarPor }) {
  const [ordenarPor, setOrdenarPor] = useState(initialOrdenarPor || 'mais_recente');
  const [localKey, setLocalKey] = useState(0); // força reset do infiniteQuery
  const { data = [], fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useCommunityFeed(comunidadeId, { ordenarPor, key: localKey });
  const sentinelRef = useRef();
  const deletePost = useDeletePost();

  // Ao trocar o filtro, força reset do infiniteQuery (limpa cache e paginação)
  useEffect(() => {
    setLocalKey((k) => k + 1);
    // eslint-disable-next-line
  }, [ordenarPor]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div className={styles.loading}><Spinner /></div>;

  return (
    <div>
      <div className={styles.filterBar}>
        <label htmlFor="ordenarPor" className={styles.filterLabel}>Ordenar por:</label>
        <div className={styles.dropdownWrapper}>
          <select
            id="ordenarPor"
            className={styles.dropdown}
            value={ordenarPor}
            onChange={e => setOrdenarPor(e.target.value)}
          >
            {ORDER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className={styles.dropdownIcon}>&#9662;</span>
        </div>
      </div>
      <div className={styles.feed}>
        {data.map((post, idx) => {
          const key = post?.id ?? post?.postId ?? post?.idPost ?? `${comunidadeId}-${idx}`;
          return (
            <PostCard key={key} post={post} onDelete={(id) => deletePost.mutate(id)} />
          );
        })}

        <div ref={sentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && <Spinner size="sm" />}
          {!hasNextPage && <div className={styles.end}>Fim do feed</div>}
        </div>
      </div>
    </div>
  );
}
