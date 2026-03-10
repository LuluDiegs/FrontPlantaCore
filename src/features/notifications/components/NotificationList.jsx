import NotificationItem from './NotificationItem';
import { SkeletonNotification } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { BellOff } from 'lucide-react';
import styles from './NotificationList.module.css';

export default function NotificationList({ notifications, isLoading, onRead, onDelete }) {
  if (isLoading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonNotification key={i} />
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="Nenhuma notificação"
        description="Você será notificado quando houver novas interações"
      />
    );
  }

  return (
    <div className={styles.list}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
