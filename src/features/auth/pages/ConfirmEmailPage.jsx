import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useConfirmEmail } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import styles from './AuthPages.module.css';

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const confirmEmail = useConfirmEmail();

  const usuarioId = params.get('usuarioId');
  const token = params.get('token');

  useEffect(() => {
    if (usuarioId && token) {
      confirmEmail.mutate({ usuarioId, token });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!usuarioId || !token) {
    return (
      <AuthLayout>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}><XCircle size={28} /></div>
          <h2>Link inválido</h2>
          <p>O link de confirmação está incompleto ou expirou.</p>
          <Link to="/login">
            <Button variant="secondary">Voltar ao login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (confirmEmail.isSuccess && confirmEmail.data?.sucesso) {
    return (
      <AuthLayout>
        <div className={styles.successBox}>
          <div className={styles.successIcon}><CheckCircle size={28} /></div>
          <h2>Email confirmado!</h2>
          <p>Sua conta está ativa. Agora você já pode fazer login.</p>
          <Link to="/login">
            <Button fullWidth>Fazer login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (confirmEmail.isPending) {
    return (
      <AuthLayout title="Confirmando seu email...">
        <Spinner />
      </AuthLayout>
    );
  }

  if (confirmEmail.isError || (confirmEmail.data && !confirmEmail.data.sucesso)) {
    const message = confirmEmail.data?.mensagem || confirmEmail.error?.message || 'Não foi possível confirmar seu email.';
    return (
      <AuthLayout>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}><XCircle size={28} /></div>
          <h2>Erro na confirmação</h2>
          <p>{message}</p>
          <Link to="/login">
            <Button variant="secondary">Voltar ao login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
