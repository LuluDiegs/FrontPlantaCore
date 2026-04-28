import { NavLink } from 'react-router-dom';
import { Home, Compass, Camera, Search, Flower2, User, Calendar, Users, Sparkles, Store } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/buscar', label: 'Descobrir', icon: Search },
  { to: '/comunidades', label: 'Comunidades', icon: Users },
  { to: '/identificar', label: 'Identificar', icon: Camera },
  { to: '/buscar-planta', label: 'Buscar Planta', icon: Search },
  { to: '/recomendar-planta', label: 'Recomendar Planta', icon: Sparkles },
  { to: '/minhas-plantas', label: 'Minhas Plantas', icon: Flower2 },
  { to: '/eventos', label: 'Eventos', icon: Calendar },
  { to: '/lojas', label: 'Lojas', icon: Store },
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
