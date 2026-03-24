import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Trash2, Heart } from 'lucide-react';
import { useComments, useCreateComment, useDeleteComment, useToggleCommentLike, useReplyComment } from '../hooks/usePosts';
import { useAuthStore } from '../../auth/stores/authStore';
import Avatar from '../../../shared/components/ui/Avatar';
import Spinner from '../../../shared/components/ui/Spinner';
import { timeAgo } from '../../../shared/utils/formatDate';
import styles from './PostComments.module.css';

export default function PostComments({ postId }) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: comments, isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment(postId);
  const toggleLike = useToggleCommentLike(postId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    createComment.mutate(
      { postId, conteudo: trimmed },
      { onSuccess: () => setText('') },
    );
  };

  const replyMutation = useReplyComment();

  const handleReply = (comentarioId, conteudo) => {
    if (!conteudo?.trim()) return;
    replyMutation.mutate({ comentarioId, conteudo, postId }, {
      onSuccess: () => setReplyTo(null),
    });
  };

  return (
    <div className={styles.section}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.input}
          placeholder="Escreva um comentário... (Pressione Enter para enviar ou Ctrl+Enter para nova linha)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={3}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!text.trim() || createComment.isPending}
          aria-label="Enviar comentário"
        >
          <Send size={18} />
        </button>
      </form>

      {isLoading && <Spinner size="sm" />}

      <div className={styles.list}>
        {(comments || []).map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <Link to={`/usuario/${comment.usuarioId}`}>
              <Avatar src={comment.fotoUsuario} alt={comment.usuarioNome} size="sm" />
            </Link>

            <div className={styles.body}>
              <div className={styles.bubble}>
                <Link to={`/usuario/${comment.usuarioId}`} className={styles.author}>
                  {comment.usuarioNome}
                </Link>
                <p className={styles.text}>{comment.conteudo}</p>
              </div>

              <div className={styles.meta}>
                <span>{timeAgo(comment.dataCriacao)}</span>

                <button
                  className={`${styles.likeBtn} ${comment.curtiuUsuario ? styles.liked : ''}`}
                  onClick={() => toggleLike.mutate({ comentarioId: comment.id, isLiked: !!comment.curtiuUsuario })}
                  disabled={toggleLike.isPending}
                  aria-label={comment.curtiuUsuario ? 'Descurtir comentário' : 'Curtir comentário'}
                >
                  <Heart size={12} fill={comment.curtiuUsuario ? 'currentColor' : 'none'} />
                  {comment.totalCurtidas > 0 && <span>{comment.totalCurtidas}</span>}
                </button>

                {comment.usuarioId === currentUserId && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteComment.mutate(comment.id)}
                  >
                    <Trash2 size={12} />
                    Excluir
                  </button>
                )}
                <button
                  className={styles.replyBtn}
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                >Responder</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {replyTo && (
        <div className={styles.replyBox}>
          <ReplyBox
            key={replyTo}
            comentarioId={replyTo}
            onCancel={() => setReplyTo(null)}
            onSend={(conteudo) => handleReply(replyTo, conteudo)}
          />
        </div>
      )}
    </div>
  );
}

function ReplyBox({ comentarioId, onCancel, onSend }) {
  const [val, setVal] = useState('');

  return (
    <div className={styles.replyInner}>
      <textarea
        className={styles.replyInput}
        placeholder="Escreva sua resposta... (Ctrl+Enter para nova linha)"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const content = val.trim();
            if (!content) return;
            onSend(content);
            setVal('');
          }
        }}
        maxLength={1000}
      />
      <div className={styles.replyActions}>
        <button className={styles.replySend} onClick={() => { const c = val.trim(); if (c) { onSend(c); setVal(''); } }}>Enviar</button>
        <button className={styles.replyCancel} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
