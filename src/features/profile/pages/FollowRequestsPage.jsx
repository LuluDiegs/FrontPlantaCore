import Button from '../../../shared/components/ui/Button';
import { useSolicitacoes, useAcceptSolicitacao, useRejectSolicitacao } from '../hooks/useProfile';
import Spinner from '../../../shared/components/ui/Spinner';
import styles from './FollowRequestsPage.module.css';

export default function FollowRequestsPage() {
  const { data: requests = [], isLoading } = useSolicitacoes();
  const accept = useAcceptSolicitacao();
  const reject = useRejectSolicitacao();

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.page}>
      <h1>Solicitações de seguir</h1>
      {requests.length === 0 && <p>Nenhuma solicitação pendente</p>}
      <ul className={styles.list}>
        {requests.map((r) => (
          <li key={r.id} className={styles.item}>
            <div>
              <strong>{r.usuario?.nome || r.nome}</strong>
              <div className={styles.actions}>
                <Button size="sm" onClick={() => accept.mutate(r.id)}>Aceitar</Button>
                <Button size="sm" variant="ghost" onClick={() => reject.mutate(r.id)}>Rejeitar</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
