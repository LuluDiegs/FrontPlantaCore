import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { loginSchema } from '../schemas';
import { useLogin } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import ResendConfirmationModal from '../components/ResendConfirmationModal';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const [resendOpen, setResendOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const login = useLogin();

  const onSubmit = (data) => login.mutate(data);

  return (
    <>
      <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            icon={Lock}
            error={errors.senha?.message}
            {...register('senha')}
          />

          <div className={styles.forgotLink}>
            <Link to="/resetar-senha">Esqueceu a senha?</Link>
            <button type="button" onClick={() => setResendOpen(true)} className={styles.linkBtn}>
              Reenviar email?
            </button>
          </div>

          <Button type="submit" fullWidth loading={login.isPending}>
            Entrar
          </Button>
        </form>

        <p className={styles.footer}>
          Não tem conta? <Link to="/registrar">Criar conta</Link>
        </p>
      </AuthLayout>

      <ResendConfirmationModal isOpen={resendOpen} onClose={() => setResendOpen(false)} />
    </>
  );
}
