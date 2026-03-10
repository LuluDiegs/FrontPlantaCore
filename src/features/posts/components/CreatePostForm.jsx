import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flower2 } from 'lucide-react';
import { useCreatePost } from '../hooks/usePosts';
import { useMyPlants } from '../../plants/hooks/usePlants';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import styles from './CreatePostForm.module.css';

const postSchema = z.object({
  conteudo: z.string().min(1, 'Escreva algo no seu post').max(5000),
});

export default function CreatePostForm() {
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const { data: plantsData, isLoading: plantsLoading } = useMyPlants(1);
  const createPost = useCreatePost();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
  });

  const plants = plantsData?.itens || [];

  const onSubmit = (data) => {
    if (!selectedPlantId) return;
    createPost.mutate({
      plantaId: selectedPlantId,
      conteudo: data.conteudo,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.plantPicker}>
        <label className={styles.label}>
          <Flower2 size={16} />
          Selecione uma planta
        </label>

        {plantsLoading && <Spinner size="sm" />}

        {!plantsLoading && !plants.length && (
          <p className={styles.hint}>
            Você precisa ter pelo menos uma planta pra criar um post.
          </p>
        )}

        {plants.length > 0 && (
          <div className={styles.plantGrid}>
            {plants.map((plant) => (
              <button
                key={plant.id}
                type="button"
                className={`${styles.plantOption} ${selectedPlantId === plant.id ? styles.selected : ''}`}
                onClick={() => setSelectedPlantId(plant.id)}
              >
                {plant.fotoPlanta ? (
                  <img src={plant.fotoPlanta} alt="" className={styles.plantImg} crossOrigin="anonymous" />
                ) : (
                  <div className={styles.plantPlaceholder}>
                    <Flower2 size={16} />
                  </div>
                )}
                <span>{plant.nomeComum || plant.nomeCientifico}</span>
              </button>
            ))}
          </div>
        )}

        {!selectedPlantId && plants.length > 0 && (
          <p className={styles.hint}>Escolha a planta relacionada ao post</p>
        )}
      </div>

      <div className={styles.textGroup}>
        <textarea
          className={`${styles.textarea} ${errors.conteudo ? styles.textareaError : ''}`}
          placeholder="Compartilhe algo sobre essa planta..."
          rows={5}
          maxLength={5000}
          {...register('conteudo')}
        />
        {errors.conteudo && (
          <span className={styles.error}>{errors.conteudo.message}</span>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={createPost.isPending}
        disabled={!selectedPlantId || createPost.isPending}
      >
        Publicar
      </Button>
    </form>
  );
}
