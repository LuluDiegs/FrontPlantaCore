import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, AlertTriangle, Leaf } from 'lucide-react';
import Avatar from '../../../shared/components/ui/Avatar';
import { timeAgo } from '../../../shared/utils/formatDate';
import styles from './NotificationItem.module.css';

const NOTIFICATION_CONFIG = {
  Curtida: {
    icon: Heart,
    color: '#e74c6f',
    label: 'curtiu seu post',
  },
  Comentario: {
    icon: MessageCircle,
    color: '#3b82f6',
    label: 'comentou no seu post',
  },
  NovoSeguidor: {
    icon: UserPlus,
    color: '#2D6A4F',
    label: 'começou a seguir você',
  },
  AlertaToxicidade: {
    icon: AlertTriangle,
    color: '#f59e0b',
    label: 'Alerta de toxicidade',
  },
  LembreteCuidado: {
    icon: Leaf,
    color: '#52B788',
    label: 'Lembrete de cuidado',
  },
};

function getNotificationRoute(notification) {
  if (notification.postId) return `/post/${notification.postId}`;
  if (notification.plantaId) return `/planta/${notification.plantaId}`;
  if (notification.usuarioOrigemId) return `/usuario/${notification.usuarioOrigemId}`;
  return null;
}

export default function NotificationItem({ notification, onRead, onDelete }) {
  const navigate = useNavigate();

  const config = NOTIFICATION_CONFIG[notification.tipo] || NOTIFICATION_CONFIG.LembreteCuidado;
  const Icon = config.icon;
  const route = getNotificationRoute(notification);

  const handleClick = () => {
    if (!notification.lida) {
      onRead(notification.id);
    }
    if (route) {
      navigate(route);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={`${styles.item} ${!notification.lida ? styles.unread : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.iconWrapper} style={{ backgroundColor: `${config.color}15` }}>
        <Icon size={18} color={config.color} />
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          {notification.usuarioOrigemNome ? (
            <p>
              <strong>{notification.usuarioOrigemNome}</strong>{' '}
              {notification.mensagem || config.label}
            </p>
          ) : (
            <p>{notification.mensagem || config.label}</p>
          )}
          <span className={styles.time}>{timeAgo(notification.dataCriacao)}</span>
        </div>

        {notification.fotoUsuarioOrigem && (
          <Avatar src={notification.fotoUsuarioOrigem} size="sm" />
        )}
      </div>

      <button className={styles.deleteBtn} onClick={handleDelete} aria-label="Remover notificação">
        ×
      </button>
    </div>
  );
}
