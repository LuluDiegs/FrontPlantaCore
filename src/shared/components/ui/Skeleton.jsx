import styles from './Skeleton.module.css';

export default function Skeleton({ width, height, borderRadius, className = '', variant = 'line' }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  if (borderRadius) style.borderRadius = borderRadius;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonPost() {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <Skeleton variant="circle" width={40} height={40} />
        <div className={styles.postMeta}>
          <Skeleton width="45%" height={14} />
          <Skeleton width="25%" height={12} />
        </div>
      </div>
      <Skeleton width="100%" height={16} />
      <Skeleton width="85%" height={16} />
      <Skeleton width="60%" height={16} />
      <div className={styles.postFooter}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.plantCard}>
      <Skeleton width="100%" height={0} className={styles.plantImage} />
      <div className={styles.plantInfo}>
        <Skeleton width="75%" height={14} />
        <Skeleton width="50%" height={12} />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className={styles.profile}>
      <div className={styles.profileTop}>
        <Skeleton variant="circle" width={80} height={80} />
        <div className={styles.profileInfo}>
          <Skeleton width="50%" height={18} />
          <Skeleton width="35%" height={12} />
          <Skeleton width="80%" height={14} />
        </div>
      </div>
      <div className={styles.profileStats}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={56} borderRadius="var(--radius-sm)" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonNotification() {
  return (
    <div className={styles.notification}>
      <Skeleton variant="circle" width={40} height={40} />
      <div className={styles.notifBody}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="30%" height={12} />
      </div>
    </div>
  );
}
