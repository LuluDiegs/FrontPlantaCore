import { useSearchParams } from 'react-router-dom';
import styles from './ProfileTabs.module.css';

const TABS = [
  { key: 'posts', label: 'Posts' },
  { key: 'seguidores', label: 'Seguidores' },
  { key: 'seguindo', label: 'Seguindo' },
];

export default function ProfileTabs({ children }) {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get('tab') || 'posts';

  return (
    <div>
      <div className={styles.tabs}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.tab} ${activeTab === key ? styles.active : ''}`}
            onClick={() => setParams(key === 'posts' ? {} : { tab: key })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {children(activeTab)}
      </div>
    </div>
  );
}
