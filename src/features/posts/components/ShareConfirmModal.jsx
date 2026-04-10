import { useState } from 'react';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import Avatar from '../../../shared/components/ui/Avatar';
import styles from './ShareConfirmModal.module.css';

export default function ShareConfirmModal({ isOpen, onClose, onConfirm, loading, post }) {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(comment);
  };

  const parseConteudo = (raw) => {
    if (!raw) return { texto: '', imagem: null };
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return { texto: parsed.texto || parsed.text || '', imagem: parsed.imagem || parsed.imagemUrl || null };
      } catch (e) {
        return { texto: raw, imagem: null };
      }
    }
    if (typeof raw === 'object') return { texto: raw.texto || raw.text || '', imagem: raw.imagem || raw.imagemUrl || null };
    return { texto: String(raw), imagem: null };
  };

  const authorName = post ? (post.usuario?.nomeCompleto || post.nomeUsuario || post.usuarioNome || post.autor?.nome || post.usuario?.nome || 'Usuário') : 'Usuário';
  const { texto: previewTextoRaw, imagem: previewImg } = post ? parseConteudo(post.conteudo ?? post.conteudoPost ?? post.texto ?? post.descricao) : { texto: '', imagem: null };
  const previewTexto = String(previewTextoRaw || '').trim();
  const shouldShowPreviewText = previewTexto.length >= 20; // avoid showing tiny noise like "iu"
  const createdAt = post?.dataCriacao || post?.createdAt || post?.created_at || post?.data || null;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleString('pt-BR') : null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar compartilhamento">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>Deseja compartilhar esta publicação?</h3>
        </div>

        {post && (
          <div className={styles.preview}>
            <div className={styles.previewLeft}>
              <Avatar src={post.usuario?.avatar || post.fotoUsuario || post.fotoPlanta || post.autor?.avatar} alt={authorName} size="md" />
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewHeader}>
                <strong className={styles.previewAuthor}>{authorName}</strong>
                {formattedDate && <span className={styles.previewDate}>{formattedDate}</span>}
              </div>
              {previewImg ? (
                <img src={previewImg} alt="preview" className={styles.previewImg} />
              ) : shouldShowPreviewText ? (
                <p className={styles.previewSnippet}>{previewTexto.slice(0, 300)}</p>
              ) : (
                <p className={styles.previewEmpty}>— Sem conteúdo significativo —</p>
              )}
            </div>
          </div>
        )}

        <label className={styles.label}>Adicionar comentário (opcional)</label>
        <textarea
          className={styles.textarea}
          placeholder="Escreva algo sobre essa publicação..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} loading={loading}>Compartilhar</Button>
        </div>
      </div>
    </Modal>
  );
}
