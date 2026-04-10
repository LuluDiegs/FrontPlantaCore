import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle } from 'lucide-react';
import { useResendConfirmation } from '../../auth/hooks/useAuth';
import Modal from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import styles from './ResendConfirmationModal.module.css';

const resendSchema = z.object({
    email: z.string().email('Email inválido'),
});

export default function ResendConfirmationModal({ isOpen, onClose }) {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(resendSchema),
    });

    const email = watch('email');
    const resendConfirmation = useResendConfirmation();
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = (data) => {
        resendConfirmation.mutate(data.email, {
            onSuccess: (res) => {
                if (res.sucesso) {
                    setEmailSent(true);
                    setTimeout(() => {
                        reset();
                        setEmailSent(false);
                        onClose();
                    }, 3000);
                }
            },
        });
    };

    if (emailSent) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Email Reenviado">
                <div className={styles.success}>
                    <CheckCircle size={28} />
                    <h3>Email enviado!</h3>
                    <p>Verifique sua caixa de entrada e spam em <strong>{email}</strong></p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Reenviar Email de Confirmação">
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={resendConfirmation.isPending}>
                        Reenviar Email
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
