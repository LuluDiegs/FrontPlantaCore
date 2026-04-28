import { CheckCheck, Trash2 } from 'lucide-react';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '../hooks/useNotifications';
import NotificationList from '../components/NotificationList';
import Button from '../../../shared/components/ui/Button';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const { data: settings } = useNotificationSettings();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();
  const updateSettings = useUpdateNotificationSettings();

  let notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  let hasNotifications = notifications.length > 0;
  const settingEntries = [
    ['receberCurtidas', 'Curtidas'],
    ['receberComentarios', 'Comentários'],
    ['receberNovoSeguidor', 'Novos seguidores'],
    ['receberSolicitacaoSeguir', 'Solicitações de seguir'],
    ['receberSolicitacaoAceita', 'Solicitações aceitas'],
    ['receberEvento', 'Eventos'],
    ['receberPlantaCuidado', 'Lembretes de cuidado'],
    ['receberPlantaIdentificada', 'Plantas identificadas'],
  ];

  // Se o contador for maior que zero mas a lista está vazia, mostra placeholders
  if (!hasNotifications && unreadCount > 0) {
    notifications = Array.from({ length: unreadCount }).map((_, i) => ({
      id: `placeholder-${i}`,
      tipo: 'LembreteCuidado',
      mensagem: 'Notificação não lida',
      lida: false,
      dataCriacao: new Date().toISOString(),
    }));
    hasNotifications = true;
  }

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

      {settings && (
        <section className={styles.settingsSection}>
          <div className={styles.settingsHeader}>
            <h2>Preferências</h2>
            <p>Essas opções atualizam diretamente as configurações do backend.</p>
          </div>

          <div className={styles.settingsGrid}>
            {settingEntries.map(([key, label]) => (
              <label key={key} className={styles.settingItem}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(settings[key])}
                  onChange={(event) =>
                    updateSettings.mutate({
                      ...settings,
                      [key]: event.target.checked,
                    })
                  }
                  disabled={updateSettings.isPending}
                />
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
