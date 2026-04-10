import React from 'react';
import { Heart } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import PostComments from './PostComments';
import { useToggleLike } from '../hooks/usePosts';
import styles from './PostItem.module.css';

function parseConteudo(conteudo) {
  if (!conteudo) return { texto: '', imagem: null };
  if (typeof conteudo === 'string') {
    try { const parsed = JSON.parse(conteudo); return { texto: parsed.texto || parsed.text || '', imagem: parsed.imagem || parsed.imagemUrl || null }; } catch (e) { return { texto: conteudo, imagem: null }; }
  }
  if (typeof conteudo === 'object') return { texto: conteudo.texto || conteudo.text || '', imagem: conteudo.imagem || conteudo.imagemUrl || null };
  return { texto: String(conteudo), imagem: null };
}

export default function PostItem({ post }) {
  const toggleLike = useToggleLike();

  const { texto, imagem } = parseConteudo(post?.conteudo ?? post?.conteudoPost);

  const handleLike = () => toggleLike.mutate({ postId: post.id, isLiked: !!post.curtiuUsuario });

  return (
    <article className={styles.item}>
      <header className={styles.header}>
        <div className={styles.avatar}>{(post?.autor?.nome || post?.usuarioNome || 'U').charAt(0)}</div>
        <div>
          <strong>{post?.autor?.nome || post?.usuarioNome || 'Usuário'}</strong>
          <div className={styles.meta}>{new Date(post?.dataCriacao || Date.now()).toLocaleString('pt-BR')}</div>
        </div>
      </header>

      <div className={styles.content}>
        <p className={styles.text}>{texto}</p>
        {imagem && <img src={imagem} alt="attachment" className={styles.image} crossOrigin="anonymous" />}
      </div>

      <footer className={styles.footer}>
        <button className={`${styles.likeBtn} ${post.curtiuUsuario ? styles.liked : ''}`} onClick={handleLike}>
          <Heart size={16} />
          <span>{post.totalCurtidas || 0}</span>
        </button>
      </footer>

      <PostComments postId={post.id} />
    </article>
  );
}
