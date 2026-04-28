import { NavLink } from 'react-router-dom';
import { Home, Compass, Camera, Search, User, Users } from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/buscar', label: 'Buscar', icon: Search },
  { to: '/comunidades', label: 'Comun.', icon: Users },
  { to: '/identificar', label: 'Identificar', icon: Camera },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
