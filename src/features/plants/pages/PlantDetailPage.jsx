import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Trash2, BellRing, Calendar } from 'lucide-react';
import { usePlantDetail, useDeletePlant, useGenerateCareReminder } from '../hooks/usePlants';
import PlantCareInfo from '../components/PlantCareInfo';
import ToxicityBanner from '../components/ToxicityBanner';
import Spinner from '../../../shared/components/ui/Spinner';
import Button from '../../../shared/components/ui/Button';
import Modal from '../../../shared/components/ui/Modal';
import { fullDate } from '../../../shared/utils/formatDate';
import styles from './PlantDetailPage.module.css';

export default function PlantDetailPage() {
  const { plantaId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: plant, isLoading } = usePlantDetail(plantaId);
  const deletePlant = useDeletePlant();
  const generateReminder = useGenerateCareReminder();

  if (isLoading) return <Spinner />;
  if (!plant) return null;

  const displayName = plant.nomeComum || plant.nomeCientifico;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      {plant.fotoPlanta && (
        <div className={styles.imageWrapper}>
          <img src={plant.fotoPlanta} alt={displayName} className={styles.image} crossOrigin="anonymous" />
        </div>
      )}

      <div className={styles.titleSection}>
        <h1>{displayName}</h1>
        {plant.nomeComum && plant.nomeCientifico && (
          <span className={styles.scientific}>{plant.nomeCientifico}</span>
        )}
      </div>

      <div className={styles.meta}>
        {plant.familia && (
          <div className={styles.metaItem}>
            <Leaf size={16} />
            <span>Família: <strong>{plant.familia}</strong></span>
          </div>
        )}
        {plant.genero && (
          <div className={styles.metaItem}>
            <Leaf size={16} />
            <span>Gênero: <strong>{plant.genero}</strong></span>
          </div>
        )}
        {plant.dataIdentificacao && (
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>Identificada em: <strong>{fullDate(plant.dataIdentificacao)}</strong></span>
          </div>
        )}
      </div>

      <ToxicityBanner plant={plant} />

      <PlantCareInfo plant={plant} />

      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => generateReminder.mutate(plantaId)}
          loading={generateReminder.isPending}
        >
          <BellRing size={16} />
          Gerar lembrete de cuidado
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} />
          Remover planta
        </Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remover planta"
      >
        <p className={styles.deleteText}>
          Tem certeza que deseja remover <strong>{displayName}</strong> da sua coleção? Essa ação não pode ser desfeita.
        </p>
        <div className={styles.deleteActions}>
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deletePlant.mutate(plantaId)}
            loading={deletePlant.isPending}
          >
            Remover
          </Button>
        </div>
      </Modal>
    </div>
  );
}
