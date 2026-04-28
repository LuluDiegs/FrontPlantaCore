import { Link } from 'react-router-dom';
import { Settings, UserPlus, UserMinus } from 'lucide-react';
import Avatar from '../../../shared/components/ui/Avatar';
import Button from '../../../shared/components/ui/Button';
import { compactNumber } from '../../../shared/utils/formatNumber';
import { useToggleFollow, useRequestFollow } from '../hooks/useProfile';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader({ profile, isOwn = false }) {
  const toggleFollow = useToggleFollow();

  if (!profile) return null;

  const stats = [
    { label: 'Seguidores', value: profile.totalSeguidores, link: 'seguidores' },
    { label: 'Seguindo', value: profile.totalSeguindo, link: 'seguindo' },
    { label: 'Plantas', value: profile.totalPlantas },
  ];

  if (isOwn && profile.totalPosts !== undefined) {
    stats.push({ label: 'Posts', value: profile.totalPosts });
  }

  const handleFollowToggle = () => {
    toggleFollow.mutate({
      usuarioId: profile.id,
      isFollowing: profile.userSegueEste,
    });
  };

  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <Avatar src={profile.fotoPerfil} alt={profile.nome} size="xl" />

        <div className={styles.info}>
          <h1 className={styles.name}>{profile.nome}</h1>

          {isOwn && profile.email && (
            <span className={styles.email}>{profile.email}</span>
          )}

          {profile.biografia && (
            <p className={styles.bio}>{profile.biografia}</p>
          )}
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map(({ label, value, link }) => {
          const content = (
            <div key={label} className={styles.stat}>
              <strong>{compactNumber(value)}</strong>
              <span>{label}</span>
            </div>
          );

          if (link) {
            return (
              <Link key={label} to={`?tab=${link}`} className={styles.statLink}>
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>

      <div className={styles.actions}>
        {isOwn ? (
          <Link to="/perfil/editar">
            <Button variant="secondary" size="sm">
              <Settings size={16} />
              Editar perfil
            </Button>
          </Link>
        ) : (
          <ProfileActionButtons profile={profile} toggleFollow={toggleFollow} />
        )}
      </div>
    </div>
  );
}

function ProfileActionButtons({ profile, toggleFollow }) {
  const requestFollow = useRequestFollow();

  const handleRequest = () => {
    requestFollow.mutate(profile.id);
  };

  if (profile.userSegueEste) {
    return (
      <Button
        variant="ghost"
        size="sm"
        loading={toggleFollow.isPending}
        onClick={() => toggleFollow.mutate({ usuarioId: profile.id, isFollowing: true })}
      >
        <UserMinus size={16} /> Seguindo
      </Button>
    );
  }

  if (profile.privado) {
    return (
      <Button variant="primary" size="sm" onClick={handleRequest} loading={requestFollow.isPending}>
        Solicitar
      </Button>
    );
  }

  return (
    <Button variant="primary" size="sm" onClick={() => toggleFollow.mutate({ usuarioId: profile.id, isFollowing: false })} loading={toggleFollow.isPending}>
      <UserPlus size={16} /> Seguir
    </Button>
  );
}
