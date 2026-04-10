import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './ErrorPages.module.css';

export default function ErrorPage() {
  const error = useRouteError?.();

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <AlertTriangle size={48} />
      </div>
      <h1 className={styles.code}>Ops!</h1>
      <h2 className={styles.title}>Algo deu errado</h2>
      <p className={styles.description}>
        {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <RotateCcw size={16} /> Tentar novamente
        </Button>
        <Link to="/feed">
          <Button>
            <Home size={16} /> Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}
