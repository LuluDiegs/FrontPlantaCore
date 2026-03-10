import styles from './Spinner.module.css';

/**
 * Spinner de carregamento centralizado.
 *
 * @param {'sm' | 'md' | 'lg'} size
 */
export default function Spinner({ size = 'md' }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}
