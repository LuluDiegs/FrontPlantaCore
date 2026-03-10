import { Link } from 'react-router-dom';
import Avatar from '../../../shared/components/ui/Avatar';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { Users } from 'lucide-react';
import styles from './UserList.module.css';

export default function UserList({ data, isLoading, emptyMessage = 'Nenhum usuário encontrado' }) {
  if (isLoading) return <Spinner />;

  const users = data?.itens || data || [];

  if (!users.length) {
    return <EmptyState icon={Users} title={emptyMessage} />;
  }

  return (
    <div className={styles.list}>
      {users.map((user) => (
        <Link key={user.id} to={`/usuario/${user.id}`} className={styles.item}>
          <Avatar src={user.fotoPerfil} alt={user.nome} size="md" />
          <div className={styles.info}>
            <span className={styles.name}>{user.nome}</span>
            {user.biografia && (
              <span className={styles.bio}>{user.biografia}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
