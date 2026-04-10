import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Lock } from 'lucide-react';
import { useDeleteAccount } from '../../auth/hooks/useAuth';
import Modal from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './DeleteAccountModal.module.css';

const deleteAccountSchema = z.object({
    senha: z.string().min(1, 'Senha é obrigatória'),
    confirmacao: z.string().refine(val => val === 'CONFIRMAR', {
        message: 'Digite "CONFIRMAR" para confirmar a exclusão',
    }),
});

export default function DeleteAccountModal({ isOpen, onClose }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(deleteAccountSchema),
    });

    const deleteAccount = useDeleteAccount();

    const onSubmit = (data) => {
        deleteAccount.mutate(data.senha, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Deletar Conta">
            <div className={styles.warning}>
                <AlertTriangle size={20} />
                <p>Esta ação é irreversível. Todos os seus dados serão deletados permanentemente.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Sua Senha"
                    type="password"
                    placeholder="Confirme sua senha"
                    icon={Lock}
                    error={errors.senha?.message}
                    {...register('senha')}
                />

                <Input
                    label="Confirmação"
                    type="text"
                    placeholder="Digite CONFIRMAR para prosseguir"
                    error={errors.confirmacao?.message}
                    {...register('confirmacao')}
                />

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="danger" loading={deleteAccount.isPending}>
                        Deletar Conta Permanentemente
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
