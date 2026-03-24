import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle } from 'lucide-react';
import styles from './PlantCard.module.css';

function highlightText(text = '', term = '') {
  if (!term) return text;
  const t = term.trim();
  if (!t) return text;
  const lcText = text.toLowerCase();
  const lcTerm = t.toLowerCase();
  const parts = [];
  let idx = 0;
  while (true) {
    const found = lcText.indexOf(lcTerm, idx);
    if (found === -1) {
      parts.push(text.slice(idx));
      break;
    }
    if (found > idx) parts.push(text.slice(idx, found));
    parts.push({ match: text.slice(found, found + t.length) });
    idx = found + t.length;
  }
  return parts.map((p, i) => (typeof p === 'string' ? p : /* eslint-disable-next-line react/no-array-index-key */ (
    <mark className={styles.highlight} key={i}>{p.match}</mark>
  )));
}

export default function PlantCard({ plant, highlight = '' }) {
  const name = plant.nomeComum || plant.nomeCientifico || '';
  const subtitle = plant.nomeComum ? plant.nomeCientifico : plant.familia || '';
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
        <h3 className={styles.name}>{highlight ? highlightText(name, highlight) : name}</h3>
        {subtitle && <span className={styles.subtitle}>{highlight ? highlightText(subtitle, highlight) : subtitle}</span>}
      </div>
    </Link>
  );
}
