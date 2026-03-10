import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Check, Circle } from 'lucide-react';
import { registerSchema } from '../schemas';
import { useRegister } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './AuthPages.module.css';

const PASSWORD_HINTS = [
  { test: (v) => v?.length >= 8, label: 'Mínimo 8 caracteres' },
  { test: (v) => /[a-z]/.test(v || ''), label: 'Uma letra minúscula' },
  { test: (v) => /[A-Z]/.test(v || ''), label: 'Uma letra maiúscula' },
  { test: (v) => /[0-9]/.test(v || ''), label: 'Um número' },
  { test: (v) => /[^a-zA-Z0-9]/.test(v || ''), label: 'Um caractere especial' },
];

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();
  const senhaValue = watch('senha', '');

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <AuthLayout title="Criar conta" subtitle="Junte-se à comunidade de amantes de plantas">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Nome"
          placeholder="Seu nome completo"
          icon={User}
          error={errors.nome?.message}
          {...register('nome')}
        />

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
          placeholder="Crie uma senha forte"
          icon={Lock}
          error={errors.senha?.message}
          {...register('senha')}
        />

        <div className={styles.passwordHints}>
          {PASSWORD_HINTS.map(({ test, label }) => {
            const valid = test(senhaValue);
            return (
              <span key={label} className={`${styles.hint} ${valid ? styles.hintValid : ''}`}>
                {valid ? <Check size={12} /> : <Circle size={12} />}
                {label}
              </span>
            );
          })}
        </div>

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          icon={Lock}
          error={errors.confirmacaoSenha?.message}
          {...register('confirmacaoSenha')}
        />

        <Button type="submit" fullWidth loading={registerMutation.isPending}>
          Criar conta
        </Button>
      </form>

      <p className={styles.footer}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </AuthLayout>
  );
}
