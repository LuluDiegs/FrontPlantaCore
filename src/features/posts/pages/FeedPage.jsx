import { Link } from 'react-router-dom';
import { PenSquare, Compass, Rss } from 'lucide-react';
import { useFeed, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import Button from '../../../shared/components/ui/Button';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeed();

  const deletePost = useDeletePost();
  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Feed</h1>
        <Link to="/criar-post">
          <Button size="sm">
            <PenSquare size={16} />
            Novo post
          </Button>
        </Link>
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
          icon={Rss}
          title="Seu feed está vazio"
          description="Siga outros usuários ou explore posts públicos para começar"
          action={
            <Link to="/explorar">
              <Button variant="secondary">
                <Compass size={16} /> Explorar
              </Button>
            </Link>
          }
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
