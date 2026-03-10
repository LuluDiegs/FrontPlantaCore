import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { careReminderService } from '../services/careReminderService';

export function useGenerateCareReminder() {
    return useMutation({
        mutationFn: careReminderService.generateForPlant,
        onSuccess: (data) => {
            if (data.sucesso) {
                toast.success('Lembrete de cuidado gerado!');
            } else {
                toast.error(data.mensagem || 'Erro ao gerar lembrete');
            }
        },
        onError: (err) => {
            const msg = err.response?.data?.mensagem || 'Erro ao gerar lembrete';
            toast.error(msg);
        },
    });
}

export function useGenerateCareRemindersForAll() {
    return useMutation({
        mutationFn: careReminderService.generateForAllPlants,
        onSuccess: (data) => {
            if (data.sucesso) {
                toast.success('Lembretes gerados para todas as plantas!');
            } else {
                toast.error(data.mensagem || 'Erro ao gerar lembretes');
            }
        },
        onError: (err) => {
            const msg = err.response?.data?.mensagem || 'Erro ao gerar lembretes';
            toast.error(msg);
        },
    });
}
