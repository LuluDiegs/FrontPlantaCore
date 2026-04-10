import { Bookmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import { useSavedPosts } from '../../usuario/hooks/useUsuario';
import styles from './FeedPage.module.css';

export default function SavedPostsPage() {
  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSavedPosts();

  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1>Salvos</h1>
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
          icon={Bookmark}
          title="Nenhum post salvo"
          description="Você ainda não salvou nenhuma publicação"
        />
      )}

      <div className={styles.list}>
        {(() => {
          const arr = posts || [];
          const uniq = Array.from(new Map(arr.map((p) => [p.id, p])).values());
          return uniq.map((post) => (
            <PostCard key={post.id} post={post} />
          ));
        })()}
      </div>

      {isFetchingNextPage && <Spinner size="sm" />}
      <div ref={ref} />
    </div>
  );
}
