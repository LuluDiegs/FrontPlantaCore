import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { useChangePassword } from '../../auth/hooks/useAuth';
import Modal from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './ChangePasswordModal.module.css';

const passwordRules = z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .regex(/[a-z]/, 'Precisa ter uma letra minúscula')
    .regex(/[A-Z]/, 'Precisa ter uma letra maiúscula')
    .regex(/[0-9]/, 'Precisa ter um número')
    .regex(/[^a-zA-Z0-9]/, 'Precisa ter um caractere especial');

const changePasswordSchema = z.object({
    senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
    novaSenha: passwordRules,
    confirmacaoSenha: z.string(),
}).refine(data => data.novaSenha === data.confirmacaoSenha, {
    message: 'Senhas não conferem',
    path: ['confirmacaoSenha'],
});

export default function ChangePasswordModal({ isOpen, onClose }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(changePasswordSchema),
    });

    const changePassword = useChangePassword();

    const onSubmit = (data) => {
        changePassword.mutate(data, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Alterar Senha">
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Senha Atual"
                    type="password"
                    placeholder="Sua senha atual"
                    icon={Lock}
                    error={errors.senhaAtual?.message}
                    {...register('senhaAtual')}
                />

                <Input
                    label="Nova Senha"
                    type="password"
                    placeholder="Sua nova senha"
                    icon={Lock}
                    error={errors.novaSenha?.message}
                    {...register('novaSenha')}
                />
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                    Mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial
                </small>

                <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    placeholder="Repita a nova senha"
                    icon={Lock}
                    error={errors.confirmacaoSenha?.message}
                    {...register('confirmacaoSenha')}
                />

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={changePassword.isPending}>
                        Alterar Senha
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
