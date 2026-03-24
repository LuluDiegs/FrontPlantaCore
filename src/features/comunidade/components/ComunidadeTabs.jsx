import styles from './ComunidadeTabs.module.css';

const TABS = [
  { key: 'todas', label: 'Todas' },
  { key: 'minhas', label: 'Minhas' },
  { key: 'buscar', label: 'Buscar' },
  { key: 'criar', label: 'Criar' },
];

export default function ComunidadeTabs({ active = 'todas', onTabChange }) {
  return (
    <div className={styles.tabs}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${styles.tab} ${active === tab.key ? styles.active : ''}`}
          onClick={() => onTabChange?.(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
