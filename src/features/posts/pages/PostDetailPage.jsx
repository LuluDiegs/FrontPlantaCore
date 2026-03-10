import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePostDetail, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import PostComments from '../components/PostComments';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import styles from './PostDetailPage.module.css';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePostDetail(postId);
  const deletePost = useDeletePost();

  const handleDelete = (id) => {
    deletePost.mutate(id, {
      onSuccess: () => navigate('/feed'),
    });
  };

  if (isLoading) return <Spinner />;
  if (!post) return <EmptyState title="Post não encontrado" />;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <PostCard post={post} onDelete={handleDelete} />

      <PostComments postId={postId} />
    </div>
  );
}
