import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import styles from './EventoList.module.css';

export default function EventoList({ eventos = [], onOpen }) {
  const navigate = useNavigate();
  const list = Array.isArray(eventos) ? eventos : eventos?.itens ?? [];

  if (!list || list.length === 0) return <div>Nenhum evento encontrado.</div>;

  return (
    <div className={styles.list}>
      {list.map((e) => {
        const id = e.id || e.eventoId || e.core;
        return (
          <div className={styles.item} key={id}>
            <div className={styles.info}>
              <div className={styles.titulo}>{e.titulo}</div>
              <div className={styles.meta}>{e.localizacao} • {e.dataInicio && new Date(e.dataInicio).toLocaleString()}</div>
            </div>
            <div className={styles.actions}>
              <Button variant="ghost" onClick={() => navigate(`/eventos/${id}`)}>Abrir</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
