import { Link } from 'react-router-dom';
import { LogOut, Leaf } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { useLogout } from '../../../features/auth/hooks/useAuth';
import { useMyProfile } from '../../../features/profile/hooks/useProfile';
import NotificationBadge from '../../../features/notifications/components/NotificationBadge';
import styles from './Header.module.css';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { data: profile } = useMyProfile();

  const fotoPerfil = profile?.fotoPerfil || user?.fotoPerfil;
  const nome = profile?.nome || user?.nome;

  return (
    <header className={styles.header}>
      <Link to="/feed" className={styles.logo}>
        <Leaf size={24} />
        <span>PlantID</span>
      </Link>

      <nav className={styles.nav}>
        <NotificationBadge />

        {user && (
          <Link to="/perfil" className={styles.userChip}>
            {fotoPerfil ? (
              <img src={fotoPerfil} alt={nome} className={styles.avatar} crossOrigin="anonymous" />
            ) : (
              <div className={styles.avatarFallback}>
                {nome?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <span>{nome?.split(' ')[0]}</span>
          </Link>
        )}

        <button onClick={() => logout.mutate()} className={styles.iconBtn} aria-label="Sair">
          <LogOut size={20} />
        </button>
      </nav>
    </header>
  );
}
