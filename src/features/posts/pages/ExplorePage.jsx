import React from 'react';
import { Compass, Clock, Heart, MessageSquare } from 'lucide-react';
import { useExplore, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import styles from './FeedPage.module.css';

export default function ExplorePage() {
  const [sortMode, setSortMode] = React.useState('recent');

  const sortMap = {
    recent: 'mais_recente',
    liked: 'mais_curtido',
    commented: 'mais_comentado',
    oldest: 'mais_antigo',
  };

  const backendOrdenarPor = sortMap[sortMode] || 'mais_recente';

  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useExplore({ ordenarPor: backendOrdenarPor });

  const deletePost = useDeletePost();
  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Explorar</h1>
        <div className={styles.headerActions}>
          <div className={styles.sortWrap} aria-label="Ordenar posts">
            <div className={styles.sortButtons} role="tablist" aria-label="Ordenar posts">
              <button
                type="button"
                role="tab"
                aria-pressed={sortMode === 'recent'}
                title="Mais recentes"
                className={`${styles.sortBtn} ${sortMode === 'recent' ? styles.active : ''}`}
                onClick={() => setSortMode('recent')}
              >
                <Clock className={styles.sortIcon} />
                <span>Recentes</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-pressed={sortMode === 'liked'}
                title="Mais curtidos"
                className={`${styles.sortBtn} ${sortMode === 'liked' ? styles.active : ''}`}
                onClick={() => setSortMode('liked')}
              >
                <Heart className={styles.sortIcon} />
                <span>Curtidos</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-pressed={sortMode === 'commented'}
                title="Mais comentados"
                className={`${styles.sortBtn} ${sortMode === 'commented' ? styles.active : ''}`}
                onClick={() => setSortMode('commented')}
              >
                <MessageSquare className={styles.sortIcon} />
                <span>Comentados</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={styles.list}>
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </div>
      )}

      {!isLoading && (!posts || posts.length === 0) && (
        <EmptyState
          icon={Compass}
          title="Nenhum post por aqui"
          description="Seja o primeiro a publicar!"
        />
      )}

      <div className={styles.list}>
        {(posts || []).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={(id) => deletePost.mutate(id)}
          />
        ))}
      </div>

      {isFetchingNextPage && <Spinner size="sm" />}
      <div ref={ref} />
    </div>
  );
}
