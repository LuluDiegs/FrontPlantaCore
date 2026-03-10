import { CheckCheck, Trash2 } from 'lucide-react';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '../hooks/useNotifications';
import NotificationList from '../components/NotificationList';
import Button from '../../../shared/components/ui/Button';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const hasNotifications = notifications.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Notificações</h1>
          {unreadCount > 0 && (
            <span className={styles.counter}>
              {unreadCount} {unreadCount === 1 ? 'não lida' : 'não lidas'}
            </span>
          )}
        </div>

        {hasNotifications && (
          <div className={styles.actions}>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck size={16} />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteAll.mutate()}
              disabled={deleteAll.isPending}
            >
              <Trash2 size={16} />
              Limpar
            </Button>
          </div>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onRead={(id) => markAsRead.mutate(id)}
        onDelete={(id) => deleteNotification.mutate(id)}
      />
    </div>
  );
}
