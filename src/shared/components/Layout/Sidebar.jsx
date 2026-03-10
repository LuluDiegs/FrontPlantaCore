import { NavLink } from 'react-router-dom';
import { Home, Compass, Camera, Search, Flower2, User } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/identificar', label: 'Identificar', icon: Camera },
  { to: '/buscar-planta', label: 'Buscar Planta', icon: Search },
  { to: '/minhas-plantas', label: 'Minhas Plantas', icon: Flower2 },
  { to: '/perfil', label: 'Meu Perfil', icon: User },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
