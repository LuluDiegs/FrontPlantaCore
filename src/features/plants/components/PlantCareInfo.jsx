import { Sun, Droplets, Thermometer, Heart } from 'lucide-react';
import styles from './PlantCareInfo.module.css';

const CARE_FIELDS = [
  { key: 'requisitosLuz', label: 'Luz', icon: Sun },
  { key: 'requisitosAgua', label: 'Água', icon: Droplets },
  { key: 'requisitosTemperatura', label: 'Temperatura', icon: Thermometer },
  { key: 'cuidados', label: 'Cuidados', icon: Heart },
];

export default function PlantCareInfo({ plant }) {
  const fields = CARE_FIELDS.filter(({ key }) => plant[key]);

  if (!fields.length) return null;

  return (
    <div className={styles.grid}>
      {fields.map(({ key, label, icon: Icon }) => (
        <div key={key} className={styles.card}>
          <div className={styles.header}>
            <Icon size={18} />
            <h4>{label}</h4>
          </div>
          <p className={styles.text}>{plant[key]}</p>
        </div>
      ))}
    </div>
  );
}
