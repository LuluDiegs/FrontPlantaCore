import { Link } from 'react-router-dom';
import { MapPinOff, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './ErrorPages.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <MapPinOff size={48} />
      </div>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Página não encontrada</h2>
      <p className={styles.description}>
        A página que você procura não existe ou foi movida.
      </p>
      <Link to="/feed">
        <Button>
          <Home size={16} /> Voltar ao início
        </Button>
      </Link>
    </div>
  );
}
