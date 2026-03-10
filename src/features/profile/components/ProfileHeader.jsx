import { Link } from 'react-router-dom';
import { Settings, UserPlus, UserMinus } from 'lucide-react';
import Avatar from '../../../shared/components/ui/Avatar';
import Button from '../../../shared/components/ui/Button';
import { compactNumber } from '../../../shared/utils/formatNumber';
import { useToggleFollow } from '../hooks/useProfile';
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
          <Button
            variant={profile.userSegueEste ? 'ghost' : 'primary'}
            size="sm"
            onClick={handleFollowToggle}
            loading={toggleFollow.isPending}
          >
            {profile.userSegueEste ? (
              <><UserMinus size={16} /> Seguindo</>
            ) : (
              <><UserPlus size={16} /> Seguir</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
