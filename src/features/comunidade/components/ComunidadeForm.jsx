import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import styles from './ComunidadeForm.module.css';

export function ComunidadeForm({ onSubmit, initialData = {} }) {
  const [nome, setNome] = useState(initialData.nome || '');
  const [descricao, setDescricao] = useState(initialData.descricao || '');
  const [privada, setPrivada] = useState(initialData.privada || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ nome, descricao, privada });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
      <div style={{ width: '100%', maxWidth: 520 }} className={styles.card}>
        <div className={styles.cardTopStrip} />
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Nova Comunidade</h1>
          <p className={styles.cardSubtitle}>
            Crie uma comunidade para reunir pessoas com interesses em comum. Você pode torná-la privada se quiser controlar quem entra.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label className={styles.label}>Nome</label>
            <input className={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} maxLength={100} />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>Descrição</label>
            <textarea className={styles.textarea} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>

          <div style={{ marginTop: 18, marginBottom: 8 }}>
            <div
              className={
                styles.privacyCard +
                (privada ? ' ' + styles.privacyCardActive : '')
              }
              onClick={() => setPrivada(v => !v)}
            >
              <span className={styles.privacyIcon}>
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none"><path d="M10 13.5a2 2 0 0 0 2-2V9a2 2 0 1 0-4 0v2.5a2 2 0 0 0 2 2Zm6-2.5V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v2.5A2.5 2.5 0 0 0 4.5 18h11a2.5 2.5 0 0 0 2.5-2.5V13a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm8 6.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V13a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v2.5Z" fill="#fff"/></svg>
              </span>
              <div className={styles.privacyText}>
                <span className={styles.privacyTitle}>
                  Tornar comunidade privada
                </span>
                <span className={styles.privacyDesc}>
                  Comunidades privadas exigem aprovação do admin para novos membros.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privada}
                onChange={e => setPrivada(e.target.checked)}
                className={styles.privacyCheckbox}
                tabIndex={-1}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
