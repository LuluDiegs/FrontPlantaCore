import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import { useEvent, useJoinEvent, useLeaveEvent } from '../hooks/useEvents';
import { eventsService } from '../services/eventService';
import styles from './EventDetailPage.module.css';

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, isLoading } = useEvent(id);
  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();
  const participants = useQuery({
    queryKey: ['eventParticipants', id],
    queryFn: () => eventsService.getParticipants(id),
    select: (data) => data?.dados || data || [],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingBox}>
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <EmptyState
        icon={Users}
        title="Evento não encontrado"
        description="Esse evento pode ter sido removido ou ainda não está disponível."
      />
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/eventos" className={styles.backLink}>
        <ArrowLeft size={16} />
        Voltar para eventos
      </Link>

      <section className={styles.hero}>
        <div>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </div>

        <div className={styles.heroMeta}>
          <span>{new Date(event.date).toLocaleString('pt-BR')}</span>
          <span>
            <MapPin size={16} />
            {event.location}
          </span>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => joinEvent.mutate(event.id)} loading={joinEvent.isPending}>
            Participar
          </Button>
          <Button variant="ghost" onClick={() => leaveEvent.mutate(event.id)} loading={leaveEvent.isPending}>
            Sair do evento
          </Button>
        </div>
      </section>

      <section className={styles.participantsSection}>
        <div className={styles.sectionHeader}>
          <h2>Participantes</h2>
          <span>{participants.data?.length || 0}</span>
        </div>

        {participants.isLoading ? (
          <Spinner size="sm" />
        ) : !participants.data?.length ? (
          <p className={styles.emptyText}>Ainda não há participantes confirmados.</p>
        ) : (
          <div className={styles.participantGrid}>
            {participants.data.map((participant) => (
              <Link
                key={participant.id || participant.usuarioId}
                to={`/usuario/${participant.id || participant.usuarioId}`}
                className={styles.participantCard}
              >
                <div className={styles.participantAvatar}>
                  {participant.fotoPerfil ? (
                    <img src={participant.fotoPerfil} alt={participant.nome} />
                  ) : (
                    participant.nome?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <strong>{participant.nome || 'Participante'}</strong>
                  {participant.biografia && <p>{participant.biografia}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
