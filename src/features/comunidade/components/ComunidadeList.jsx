import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import styles from './ComunidadeList.module.css';

export default function ComunidadeList({ comunidades, onJoin, onLeave }) {
  const navigate = useNavigate();
  const list = Array.isArray(comunidades) ? comunidades : (comunidades?.itens ?? []);

  if (!list || list.length === 0) {
    return <div>Nenhuma comunidade encontrada.</div>;
  }

  return (
    <div className={styles.list}>
      {list.map((com, idx) => {
        const id = com.comunidadeCore || com.id || com.comunidadeId || com.core;
        return (
          <div className={styles.item} key={id ?? `com-${idx}`}>
            <div className={styles.info}>
              <div className={styles.nome}>{com.nome}</div>
              <div className={styles.descricao}>{com.descricao}</div>
            </div>

            <div className={styles.actions}>
              {com.participando ? (
                <Button variant="ghost" onClick={() => onLeave(id)}>Sair</Button>
              ) : (
                <Button variant="primary" onClick={() => onJoin(id)}>Entrar</Button>
              )}
              <Button variant="secondary" onClick={() => navigate(`/comunidades/${id}`)}>
                Abrir
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
