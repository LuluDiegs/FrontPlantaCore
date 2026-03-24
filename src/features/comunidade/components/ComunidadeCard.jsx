import { Link } from 'react-router-dom';
import { Leaf, Users, Lock } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import styles from './ComunidadeCard.module.css';

function getMemberCount(comunidade) {
  return (
    comunidade?.quantidadeMembros ||
    comunidade?.totalMembros ||
    comunidade?.membrosCount ||
    comunidade?.membros?.length ||
    0
  );
}

export default function ComunidadeCard({ comunidade, actionLabel, onAction, actionLoading = false }) {
  if (!comunidade) return null;

  const nome = comunidade.nome || comunidade.name || 'Comunidade';
  const descricao = comunidade.descricao || comunidade.description || 'Um espaço para trocar dicas, fotos e experiências sobre plantas.';
  const memberCount = getMemberCount(comunidade);

  return (
    <article className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={styles.badge}>
          <Leaf size={14} /> Comunidade
        </span>
        {memberCount > 0 && (
          <span className={styles.members}>
            <Users size={14} /> {memberCount}
          </span>
        )}
        {Boolean(comunidade?.privada ?? comunidade?.isPrivate) && (
          <span className={styles.private} title="Comunidade privada">
            <Lock size={14} />
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{nome}</h3>
        <p className={styles.description}>{descricao}</p>
      </div>

      <div className={styles.actions}>
        <Link to={`/comunidade/${comunidade.id}`} className={styles.link}>
          Ver comunidade
        </Link>

        {actionLabel && onAction && (
          <Button size="sm" variant={actionLabel === 'Sair' ? 'secondary' : 'primary'} loading={actionLoading} onClick={() => onAction(comunidade.id)}>
            {actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
}
