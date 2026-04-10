import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema } from '../schemas';
import { useForgotPassword } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './AuthPages.module.css';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const usuarioId = params.get('usuarioId');
  const token = params.get('token');

  useEffect(() => {
    if (usuarioId && token) {
      navigate(`/nova-senha?usuarioId=${usuarioId}&token=${token}`);
    }
  }, [usuarioId, token, navigate]);

  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPassword = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword.mutate(data.email, {
      onSuccess: (res) => {
        if (res.sucesso) setEmailSent(true);
      },
    });
  };

  if (emailSent) {
    return (
      <AuthLayout>
        <div className={styles.successBox}>
          <div className={styles.successIcon}><CheckCircle size={28} /></div>
          <h2>Email enviado!</h2>
          <p>
            Enviamos um link de recuperação para <strong>{getValues('email')}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
          <Link to="/login">
            <Button variant="secondary" fullWidth>Voltar ao login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Esqueceu a senha?" subtitle="Informe seu email e enviaremos um link de recuperação">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth loading={forgotPassword.isPending}>
          Enviar link
        </Button>
      </form>

      <p className={styles.footer}>
        <Link to="/login">
          <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}
