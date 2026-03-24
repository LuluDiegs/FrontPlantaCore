import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreatePostForm from '../components/CreatePostForm';
import styles from './CreatePostPage.module.css';

export default function CreatePostPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className={styles.title}>Novo Post</h1>
      <p className={styles.subtitle}>Compartilhe algo — você pode publicar sem associar uma planta</p>

      <CreatePostForm />
    </div>
  );
}
