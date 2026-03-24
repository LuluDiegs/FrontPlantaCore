import { useState } from 'react';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import EditPostModal from './EditPostModal';
import styles from './PostCard.module.css';

export default function PostCard({ post, onDelete }) {
  const [editingPost, setEditingPost] = useState(null);

  return (
    <article className={styles.card}>
      <PostHeader post={post} onDelete={onDelete} onEdit={setEditingPost} />

      <p className={styles.content}>{post.conteudo}</p>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className={styles.hashtagsContainer}>
          {post.hashtags.map((tag) => (
            <span 
              key={tag.id} 
              className={styles.hashtag}
            >
              #{tag.nome}
            </span>
          ))}
        </div>
      )}

      {post.fotoPlanta && (
        <img
          src={post.fotoPlanta}
          alt="Foto da planta"
          className={styles.plantImage}
          loading="lazy"
          crossOrigin="anonymous"
        />
      )}

      <PostActions post={post} />

      <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} />
    </article>
  );
}