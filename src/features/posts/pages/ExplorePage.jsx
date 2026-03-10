import { Compass } from 'lucide-react';
import { useExplore, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import styles from './FeedPage.module.css';

export default function ExplorePage() {
  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useExplore();

  const deletePost = useDeletePost();
  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Explorar</h1>
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
