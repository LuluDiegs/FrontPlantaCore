import { User } from 'lucide-react';
import styles from './Avatar.module.css';

/**
 * Avatar com fallback para ícone quando não há foto.
 *
 * @param {'sm' | 'md' | 'lg' | 'xl'} size
 */
export default function Avatar({ src, alt = 'Avatar', size = 'md', className = '' }) {
  if (!src) {
    return (
      <div className={`${styles.fallback} ${styles[size]} ${className}`}>
        <User size={size === 'sm' ? 14 : size === 'md' ? 18 : size === 'lg' ? 24 : 32} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]} ${className}`}
      loading="lazy"
      crossOrigin="anonymous"
    />
  );
}
