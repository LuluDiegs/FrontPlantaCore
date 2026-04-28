import { useState } from 'react';
import { MapPin, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useJoinEvent, useLeaveEvent, useDeleteEvent } from '../hooks/useEvents';
import styles from './EventCard.module.css';
import { Link, useNavigate } from 'react-router-dom';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();
  const deleteEvent = useDeleteEvent();

  return (
    <div className={styles.card}>

      <div className={styles.cardHeader}>
        <div>
          <h3>
            <Link to={`/eventos/${event.id}`} className={styles.titleLink}>
              {event.title}
            </Link>
          </h3>
          <span className={styles.date}>
            {new Date(event.date).toLocaleString('pt-BR')}
          </span>
        </div>

        <div className={styles.menuWrapper}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(v => !v)}
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <>
              <div
                className={styles.backdrop}
                onClick={() => setMenuOpen(false)}
              />

              <div className={styles.menu}>
                <button
                  className={styles.menuItem}
                  onClick={() => navigate(`/editar-evento/${event.id}`)}
                >
                  <Pencil size={14} />
                  Editar
                </button>

                <button
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={() => {
                    setMenuOpen(false);
                    deleteEvent.mutate(event.id);
                  }}
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className={styles.description}>{event.description}</p>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <MapPin size={14} />
          <span>{event.location}</span>
        </div>

        <div className={styles.actions}>
          <button onClick={() => joinEvent.mutate(event.id)}>
            Participar
          </button>

          <button onClick={() => leaveEvent.mutate(event.id)}>
            Sair
          </button>
        </div>
      </div>

    </div>
  );
}
