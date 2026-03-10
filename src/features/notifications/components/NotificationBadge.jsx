import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../hooks/useNotifications';
import styles from './NotificationBadge.module.css';

export default function NotificationBadge({ className = '' }) {
  const { data: count = 0 } = useUnreadCount();

  return (
    <Link to="/notificacoes" className={`${styles.wrapper} ${className}`} aria-label="Notificações">
      <Bell size={20} />
      {count > 0 && (
        <span className={styles.badge}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
