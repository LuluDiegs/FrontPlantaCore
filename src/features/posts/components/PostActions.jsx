import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { useToggleLike, useToggleSave, useShare } from '../hooks/usePosts';
import { useAuthStore } from '../../auth/stores/authStore';
import { compactNumber } from '../../../shared/utils/formatNumber';
import styles from './PostActions.module.css';
import { useState } from 'react';
import ShareConfirmModal from './ShareConfirmModal';

export default function PostActions({ post }) {
  const toggleLike = useToggleLike();
  const toggleSave = useToggleSave();
  const share = useShare();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = currentUserId === post.usuarioId;

  const handleLike = () => {
    if (isOwner) return; // Não permite curtir próprio post
    toggleLike.mutate({ postId: post.id, isLiked: post.curtiuUsuario });
  };

  const handleSave = () => {
    if (!post) return;
    toggleSave.mutate({ postId: post.id, isSaved: !!post.salvoUsuario });
  };

  const handleShare = () => {
    if (!post) return;
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleConfirmShare = (comment) => {
    setOpen(false);
    share.mutate({ postId: post.id, comentario: comment });
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
      <button
        className={`${styles.btn} ${post.salvoUsuario ? styles.saved : ''}`}
        onClick={handleSave}
        title={post.salvoUsuario ? 'Remover dos salvos' : 'Salvar'}
      >
        <Bookmark size={18} fill={post.salvoUsuario ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/post/${post.id}`} className={styles.btn}>
        <MessageCircle size={18} />
        {post.totalComentarios > 0 && (
          <span>{compactNumber(post.totalComentarios)}</span>
        )}
      </Link>

      <button className={styles.btn} onClick={handleShare} title="Compartilhar">
        <Share2 size={18} />
      </button>
      <ShareConfirmModal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleConfirmShare} loading={share.isLoading} post={post} />
    </div>
  );
}
