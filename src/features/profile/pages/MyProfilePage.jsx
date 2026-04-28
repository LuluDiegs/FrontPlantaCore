import { Link } from 'react-router-dom';
import { FileText, PenSquare } from 'lucide-react';
import { useMyProfile, useMyFollowers, useMyFollowing } from '../hooks/useProfile';
import { useUserPosts, useDeletePost } from '../../posts/hooks/usePosts';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import UserList from '../components/UserList';
import PostCard from '../../posts/components/PostCard';
import { SkeletonProfile, SkeletonPost } from '../../../shared/components/ui/Skeleton';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Button from '../../../shared/components/ui/Button';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';

export default function MyProfilePage() {
  const { data: profile, isLoading } = useMyProfile();

  const followers = useMyFollowers();
  const following = useMyFollowing();

  const {
    data: posts,
    isLoading: postsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUserPosts(profile?.id);

  const deletePost = useDeletePost();
  const { ref: scrollRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  if (isLoading) return <SkeletonProfile />;
  if (!profile) return null;

  return (
    <div>
      <ProfileHeader profile={profile} isOwn />

      <ProfileTabs>
        {(tab) => {
          if (tab === 'seguidores') {
            return (
              <UserList
                data={followers.data}
                isLoading={followers.isLoading}
                emptyMessage="Nenhum seguidor ainda"
              />
            );
          }

          if (tab === 'seguindo') {
            return (
              <UserList
                data={following.data}
                isLoading={following.isLoading}
                emptyMessage="Você ainda não segue ninguém"
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
                title="Nenhum post ainda"
                description="Compartilhe algo com a comunidade"
                action={
                  <Link to="/criar-post">
                    <Button>
                      <PenSquare size={16} /> Criar post
                    </Button>
                  </Link>
                }
              />
            );
          }

          return (
            <>
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
