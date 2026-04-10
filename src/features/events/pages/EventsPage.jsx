import { Link } from 'react-router-dom';
import { Calendar, Plus, Compass } from 'lucide-react';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import Button from '../../../shared/components/ui/Button';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import styles from './EventsPage.module.css';

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1>Eventos</h1>

        <Link to="/criar-evento">
          <Button size="sm">
            <Plus size={16} />
            Novo evento
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className={styles.list}>
          <Spinner />
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="Nenhum evento encontrado"
          description="Explore eventos ou crie o seu próprio"
          action={
            <Link to="/explorar">
              <Button variant="secondary">
                <Compass size={16} /> Explorar
              </Button>
            </Link>
          }
        />
      )}

      <div className={styles.list}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>

    </div>
  );
}