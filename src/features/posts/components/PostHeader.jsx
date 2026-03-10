import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Leaf, Pencil } from 'lucide-react';
import Avatar from '../../../shared/components/ui/Avatar';
import { useAuthStore } from '../../auth/stores/authStore';
import { timeAgo } from '../../../shared/utils/formatDate';
import styles from './PostHeader.module.css';

export default function PostHeader({ post, onDelete, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = currentUserId === post.usuarioId;

  return (
    <div className={styles.header}>
      <Link to={`/usuario/${post.usuarioId}`} className={styles.user}>
        <Avatar src={post.fotoUsuario} alt={post.nomeUsuario} size="md" />
        <div>
          <span className={styles.name}>{post.nomeUsuario}</span>
          <span className={styles.time}>
            {timeAgo(post.dataCriacao)}
            {post.editado && <span className={styles.edited}> · editado</span>}
          </span>
        </div>
      </Link>

      <div className={styles.right}>
        {post.plantaId && (
          <Link to={`/planta/${post.plantaId}`} className={styles.plantTag}>
            <Leaf size={14} />
          </Link>
        )}

        {isOwner && (
          <div className={styles.menuWrapper}>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Opções"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <>
                <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.menu}>
                  <button
                    className={styles.menuItemEdit}
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit?.(post);
                    }}
                  >
                    <Pencil size={14} />
                    Editar post
                  </button>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete?.(post.id);
                    }}
                  >
                    <Trash2 size={14} />
                    Excluir post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
