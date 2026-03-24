import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import { useCreatePost } from '../hooks/usePost';
import { useMyPlants } from '../../plants/hooks/usePlants';
import styles from './CriarPostComunidade.module.css';

export default function CriarPostComunidade({ comunidadeId }) {
  const [texto, setTexto] = useState('');
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const createPost = useCreatePost(comunidadeId);
  const { data: plantsData, isLoading: plantsLoading } = useMyPlants(1);

  const plants = plantsData?.itens || [];

  const MAX = 5000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = texto.trim();
    if (!trimmed) return;

    const payload = { comunidadeId, conteudo: trimmed };
    if (selectedPlantId) payload.plantaId = selectedPlantId;

    await createPost.mutateAsync(payload);

    setTexto('');
    setSelectedPlantId(null);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <div className={styles.plantPicker}>
          <label>Planta relacionada (opcional)</label>

          {plantsLoading && <Spinner size="sm" />}

          {!plantsLoading && plants.length > 0 && (
            <div className={styles.plantGrid}>
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  type="button"
                  className={`${styles.plantOption} ${selectedPlantId === plant.id ? styles.selected : ''}`}
                  onClick={() => setSelectedPlantId((prev) => (prev === plant.id ? null : plant.id))}
                  aria-pressed={selectedPlantId === plant.id}
                >
                  {plant.fotoPlanta ? (
                    <img src={plant.fotoPlanta} alt="" className={styles.plantImg} crossOrigin="anonymous" />
                  ) : (
                    <div className={styles.plantPlaceholder} />
                  )}
                  <span>{plant.nomeComum || plant.nomeCientifico}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Compartilhe algo com a comunidade..."
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, MAX))}
          rows={8}
        />

        <div className={styles.formFooter}>
          <div className={styles.hint}>{texto.length}/{MAX}</div>
          <Button type="submit" fullWidth size="lg" loading={createPost.isPending} disabled={createPost.isPending || !texto.trim()}>
            Publicar
          </Button>
        </div>
      </div>
    </form>
  );
}
