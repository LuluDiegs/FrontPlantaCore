import React from 'react';
import styles from './ConfirmModal.module.css';
import Button from './Button';

export default function ConfirmModal({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onClose, loading = false }) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
