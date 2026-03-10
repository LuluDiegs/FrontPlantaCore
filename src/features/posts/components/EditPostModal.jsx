import { useState, useEffect } from 'react';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import { useUpdatePost } from '../hooks/usePosts';
import styles from './EditPostModal.module.css';

export default function EditPostModal({ post, onClose }) {
  const [conteudo, setConteudo] = useState('');
  const updatePost = useUpdatePost();

  useEffect(() => {
    if (post) setConteudo(post.conteudo);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = conteudo.trim();
    if (!trimmed) return;
    if (trimmed === post.conteudo) { onClose(); return; }

    updatePost.mutate(
      { postId: post.id, conteudo: trimmed },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal isOpen={!!post} onClose={onClose} title="Editar post">
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          maxLength={5000}
          rows={5}
          autoFocus
        />
        <div className={styles.footer}>
          <span className={styles.count}>{conteudo.length}/5000</span>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={updatePost.isPending}
              disabled={!conteudo.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
