import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { useToggleLike } from '../hooks/usePosts';
import { useAuthStore } from '../../auth/stores/authStore';
import { compactNumber } from '../../../shared/utils/formatNumber';
import styles from './PostActions.module.css';

export default function PostActions({ post }) {
  const toggleLike = useToggleLike();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = currentUserId === post.usuarioId;

  const handleLike = () => {
    if (isOwner) return; // Não permite curtir próprio post
    toggleLike.mutate({ postId: post.id, isLiked: post.curtiuUsuario });
  };

  return (
    <div className={styles.actions}>
      <button
        className={`${styles.btn} ${post.curtiuUsuario ? styles.liked : ''}${isOwner ? ` ${styles.disabled}` : ''}`}
        onClick={handleLike}
        disabled={isOwner}
        title={isOwner ? 'Você não pode curtir seus próprios posts' : ''}
      >
        <Heart size={18} fill={post.curtiuUsuario ? 'currentColor' : 'none'} />
        {post.totalCurtidas > 0 && (
          <span>{compactNumber(post.totalCurtidas)}</span>
        )}
      </button>

      <Link to={`/post/${post.id}`} className={styles.btn}>
        <MessageCircle size={18} />
        {post.totalComentarios > 0 && (
          <span>{compactNumber(post.totalComentarios)}</span>
        )}
      </Link>
    </div>
  );
}
