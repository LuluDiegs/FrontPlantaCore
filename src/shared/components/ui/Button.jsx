import { forwardRef } from 'react';
import styles from './Button.module.css';

/**
 * Botão reutilizável com variantes visuais.
 *
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading
 */
const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, className = '', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
});

export default Button;
