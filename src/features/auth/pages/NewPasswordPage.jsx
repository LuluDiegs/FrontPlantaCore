import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, XCircle } from 'lucide-react';
import { resetPasswordSchema } from '../schemas';
import { useResetPassword } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './AuthPages.module.css';

export default function NewPasswordPage() {
  const [params] = useSearchParams();
  const usuarioId = params.get('usuarioId');
  const token = params.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPassword = useResetPassword();

  if (!usuarioId || !token) {
    return (
      <AuthLayout>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}><XCircle size={28} /></div>
          <h2>Link inválido</h2>
          <p>O link de redefinição está incompleto ou expirou.</p>
          <Link to="/resetar-senha">
            <Button variant="secondary">Solicitar novo link</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = (data) => {
    resetPassword.mutate({
      usuarioId,
      token,
      novaSenha: data.novaSenha,
      confirmacaoSenha: data.confirmacaoSenha,
    });
  };

  return (
    <AuthLayout title="Nova senha" subtitle="Escolha uma nova senha para sua conta">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Nova senha"
          type="password"
          placeholder="Sua nova senha"
          icon={Lock}
          error={errors.novaSenha?.message}
          {...register('novaSenha')}
        />

        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="Repita a nova senha"
          icon={Lock}
          error={errors.confirmacaoSenha?.message}
          {...register('confirmacaoSenha')}
        />

        <Button type="submit" fullWidth loading={resetPassword.isPending}>
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  );
}
