import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { usePublicProfile, useFollowers, useFollowing } from '../hooks/useProfile';
import { useUserPosts, useDeletePost } from '../../posts/hooks/usePosts';
import { useAuthStore } from '../../auth/stores/authStore';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import UserList from '../components/UserList';
import PostCard from '../../posts/components/PostCard';
import { SkeletonProfile, SkeletonPost } from '../../../shared/components/ui/Skeleton';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import styles from '../../posts/pages/FeedPage.module.css';

export default function UserProfilePage() {
  const { usuarioId } = useParams();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: profile, isLoading } = usePublicProfile(usuarioId);
  const followers = useFollowers(usuarioId);
  const following = useFollowing(usuarioId);

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
    isLoading: postsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUserPosts(usuarioId, { ordenarPor: backendOrdenarPor });

  const deletePost = useDeletePost();
  const { ref: scrollRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  if (usuarioId === currentUserId) {
    return <Navigate to="/perfil" replace />;
  }

  if (isLoading) return <SkeletonProfile />;
  if (!profile) return <EmptyState title="Usuário não encontrado" />;

  return (
    <div>
      <ProfileHeader profile={profile} />

      <ProfileTabs>
        {(tab) => {
          if (tab === 'seguidores') {
            return (
              <UserList
                data={followers.data}
                isLoading={followers.isLoading}
                emptyMessage="Nenhum seguidor"
              />
            );
          }

          if (tab === 'seguindo') {
            return (
              <UserList
                data={following.data}
                isLoading={following.isLoading}
                emptyMessage="Não segue ninguém"
              />
            );
          }

          if (postsLoading) {
            return (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            );
          }

          if (!posts || posts.length === 0) {
            return (
              <EmptyState
                icon={FileText}
                title="Nenhum post"
                description="Este usuário ainda não publicou nada"
              />
            );
          }
          return (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <div className={styles.sortButtons} role="tablist" aria-label="Ordenar posts">
                  <button type="button" className={`${styles.sortBtn} ${sortMode === 'recent' ? styles.active : ''}`} onClick={() => setSortMode('recent')}>Recentes</button>
                  <button type="button" className={`${styles.sortBtn} ${sortMode === 'liked' ? styles.active : ''}`} onClick={() => setSortMode('liked')}>Curtidos</button>
                  <button type="button" className={`${styles.sortBtn} ${sortMode === 'commented' ? styles.active : ''}`} onClick={() => setSortMode('commented')}>Comentados</button>
                </div>
              </div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={(id) => deletePost.mutate(id)}
                />
              ))}
              {isFetchingNextPage && <Spinner size="sm" />}
              <div ref={scrollRef} />
            </>
          );
        }}
      </ProfileTabs>
    </div>
  );
}
