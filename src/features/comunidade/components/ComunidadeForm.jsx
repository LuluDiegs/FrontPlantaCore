import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import styles from './ComunidadeForm.module.css';

export function ComunidadeForm({ onSubmit, initialData = {} }) {
  const [nome, setNome] = useState(initialData.nome || '');
  const [descricao, setDescricao] = useState(initialData.descricao || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ nome, descricao });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label}>Nome</label>
        <input className={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} maxLength={100} />
      </div>

      <div className={styles.row}>
        <label className={styles.label}>Descrição</label>
        <textarea className={styles.textarea} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary">Salvar</Button>
      </div>
    </form>
  );
}
