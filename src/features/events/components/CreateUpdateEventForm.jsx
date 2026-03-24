import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEvent, useUpdateEvent } from '../hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import styles from './CreateUpdateEventForm.module.css';

const eventSchema = z.object({
  titulo: z.string().min(1, 'Informe o título'),
  descricao: z.string().min(1, 'Informe a descrição'),
  dataInicio: z.string().min(1, 'Informe a data'),
  localizacao: z.string().min(1, 'Informe o local'),
});

export default function CreateUpdateEventForm({ event, onClose }) {
  const navigate = useNavigate();

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const isEdit = !!event;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (event) {
      reset({
        titulo: event.title,
        descricao: event.description,
        localizacao: event.location,
        dataInicio: event.date?.slice(0, 16),
      });
    }
  }, [event, reset]);

  const onSubmit = (data) => {
    const payload = {
      titulo: data.titulo,
      descricao: data.descricao,
      localizacao: data.localizacao,
      dataInicio: new Date(data.dataInicio).toISOString(),
    };

    if (isEdit) {
      updateEvent.mutate(
        { id: event.id, data: payload },
        {
          onSuccess: () => {
            onClose?.();
            navigate(-1);
          },
        }
      );
    } else {
      createEvent.mutate(payload, {
        onSuccess: () => navigate(-1),
      });
    }
  };

  return (
    <>
      <h1 className={styles.title}>{isEdit ? 'Editar Evento' : 'Novo Evento'}</h1>
      <span className={styles.subtitle}>
        {isEdit
          ? 'Edite as informações de um evento que você já criou'
          : 'Crie um evento para conhecer novos companheiros sustentáveis'}
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Título</label>
          <input
            className={`${styles.input} ${errors.titulo ? styles.inputError : ''}`}
            {...register('titulo')}
          />
          {errors.titulo && <span className={styles.error}>{errors.titulo.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            className={`${styles.textarea} ${errors.descricao ? styles.inputError : ''}`}
            rows={4}
            {...register('descricao')}
          />
          {errors.descricao && <span className={styles.error}>{errors.descricao.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Data e hora</label>
          <input
            type="datetime-local"
            className={`${styles.input} ${errors.dataInicio ? styles.inputError : ''}`}
            {...register('dataInicio')}
          />
          {errors.dataInicio && <span className={styles.error}>{errors.dataInicio.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Localização</label>
          <input
            className={`${styles.input} ${errors.localizacao ? styles.inputError : ''}`}
            {...register('localizacao')}
          />
          {errors.localizacao && <span className={styles.error}>{errors.localizacao.message}</span>}
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={createEvent.isPending || updateEvent.isPending}
        >
          {isEdit ? 'Atualizar evento' : 'Criar evento'}
        </Button>

        {isEdit && (
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        )}
      </form>
    </>
  );
}