import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import EditPostModal from './EditPostModal';
import styles from './PostCard.module.css';

export default function PostCard({ post, onDelete }) {
  const [editingPost, setEditingPost] = useState(null);

  const parsedContent = useMemo(() => {
    const raw = post?.conteudo;
    if (!raw) return { texto: '', imagem: null };
    try {
      // Some posts store conteudo as JSON string with { texto, imagem }
      const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (obj && (obj.texto || obj.imagem)) {
        return { texto: obj.texto || '', imagem: obj.imagem || null };
      }
    } catch (e) {
      // not JSON, fall back to raw string
    }
    return { texto: String(raw) };
  }, [post]);

  return (
    <article className={styles.card}>
      <PostHeader post={post} onDelete={onDelete} onEdit={setEditingPost} />

      <Link to={`/post/${post.id}`} className={styles.contentLink} aria-label={`Abrir post de ${post.nomeUsuario}`}>
        <p className={styles.content}>{parsedContent.texto}</p>

        {parsedContent.imagem && (
          <img
            src={parsedContent.imagem}
            alt="Imagem da publicação"
            className={styles.plantImage}
            loading="lazy"
            crossOrigin="anonymous"
          />
        )}

        {post.fotoPlanta && !parsedContent.imagem && (
          <img
            src={post.fotoPlanta}
            alt="Foto da planta"
            className={styles.plantImage}
            loading="lazy"
            crossOrigin="anonymous"
          />
        )}
      </Link>

      <PostActions post={post} />

      <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} />
    </article>
  );
}
