import { User } from 'lucide-react';
import styles from './Avatar.module.css';

function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  try {
    return new URL(apiUrl).origin;
  } catch (e) {
    return apiUrl.replace(/\/api\/v1\/?$/i, '').replace(/\/$/, '') || '';
  }
}

/**
 * Avatar com fallback para ícone quando não há foto.
 * Aceita caminhos relativos retornados pelo backend e prefixa com a origem da API.
 *
 * @param {'sm' | 'md' | 'lg' | 'xl'} size
 */
export default function Avatar({ src, alt = 'Avatar', size = 'md', className = '' }) {
  const apiOrigin = getApiOrigin();

  let finalSrc = src;
  if (src && apiOrigin && !/^(https?:\/\/|data:|blob:)/i.test(src)) {
    finalSrc = src.startsWith('/') ? `${apiOrigin}${src}` : `${apiOrigin}/${src}`;
  }

  if (!finalSrc) {
    return (
      <div className={`${styles.fallback} ${styles[size]} ${className}`}>
        <User size={size === 'sm' ? 14 : size === 'md' ? 18 : size === 'lg' ? 24 : 32} />
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${styles.avatar} ${styles[size]} ${className}`}
      loading="lazy"
      crossOrigin="anonymous"
    />
  );
}
