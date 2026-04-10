import { AlertTriangle, PawPrint, Baby } from 'lucide-react';
import styles from './ToxicityBanner.module.css';

export default function ToxicityBanner({ plant }) {
  const items = [];

  if (plant.toxica === true || plant.toxica === 'Sim') {
    items.push({
      icon: AlertTriangle,
      label: 'Tóxica para humanos',
      detail: plant.descricaoToxicidade,
    });
  }

  if (plant.toxicaAnimais === true || plant.toxicaAnimais === 'Sim') {
    items.push({
      icon: PawPrint,
      label: 'Tóxica para animais',
      detail: plant.descricaoToxicidadeAnimais,
    });
  }

  if (plant.toxicaCriancas === true || plant.toxicaCriancas === 'Sim') {
    items.push({
      icon: Baby,
      label: 'Tóxica para crianças',
      detail: plant.descricaoToxicidadeCriancas,
    });
  }

  if (!items.length) return null;

  return (
    <div className={styles.banner}>
      {items.map(({ icon: Icon, label, detail }) => (
        <div key={label} className={styles.item}>
          <div className={styles.header}>
            <Icon size={16} />
            <strong>{label}</strong>
          </div>
          {detail && <p className={styles.detail}>{detail}</p>}
        </div>
      ))}
    </div>
  );
}
