import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle } from 'lucide-react';
import styles from './PlantCard.module.css';

export default function PlantCard({ plant }) {
  const name = plant.nomeComum || plant.nomeCientifico;
  const subtitle = plant.nomeComum ? plant.nomeCientifico : plant.familia;
  const isToxic = plant.toxica === true || plant.toxica === 'Sim';

  return (
    <Link to={`/planta/${plant.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {plant.fotoPlanta ? (
          <img src={plant.fotoPlanta} alt={name} className={styles.image} loading="lazy" crossOrigin="anonymous" />
        ) : (
          <div className={styles.placeholder}>
            <Leaf size={32} />
          </div>
        )}
        {isToxic && (
          <span className={styles.toxicBadge}>
            <AlertTriangle size={12} />
            Tóxica
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </Link>
  );
}
