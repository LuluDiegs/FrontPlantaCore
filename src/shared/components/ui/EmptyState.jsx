import styles from './EmptyState.module.css';

/**
 * Placeholder visual para listas vazias.
 *
 * @param {import('lucide-react').LucideIcon} icon - Ícone Lucide
 * @param {string} title - Título principal
 * @param {string} description - Texto secundário
 * @param {React.ReactNode} action - Botão de ação (opcional)
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className={styles.container}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={40} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
