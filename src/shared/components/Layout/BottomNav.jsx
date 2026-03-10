import { NavLink } from 'react-router-dom';
import { Home, Compass, Camera, Flower2, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/identificar', label: 'Identificar', icon: Camera },
  { to: '/minhas-plantas', label: 'Plantas', icon: Flower2 },
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
