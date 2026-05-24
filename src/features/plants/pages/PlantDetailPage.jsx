import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Trash2, BellRing, Calendar } from 'lucide-react';
import { usePlantDetail, useDeletePlant, useGenerateCareReminder, useUpdatePlantLocation } from '../hooks/usePlants';
import PlantCareInfo from '../components/PlantCareInfo';
import ToxicityBanner from '../components/ToxicityBanner';
import Spinner from '../../../shared/components/ui/Spinner';
import Button from '../../../shared/components/ui/Button';
import Modal from '../../../shared/components/ui/Modal';
import { fullDate } from '../../../shared/utils/formatDate';
import styles from './PlantDetailPage.module.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { DraggableMarker } from '../../../shared/components/ui/DraggableMarker';

export default function PlantDetailPage() {
  const { plantaId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: plant, isLoading } = usePlantDetail(plantaId);
  const deletePlant = useDeletePlant();
  const generateReminder = useGenerateCareReminder();

  const [shareLocation, setShareLocation] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [position, setPosition] = useState({
    lat: -23.9700,
    lng: -46.3100,
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const updateLocation = useUpdatePlantLocation();

  const hasSavedLocation =
    plant?.compartilharLocalizacao &&
    plant?.latitude &&
    plant?.longitude;

  useEffect(() => {
    if (!plant) return;

    setShareLocation(plant.compartilharLocalizacao ?? false);

    if (plant.latitude && plant.longitude) {
      setPosition({
        lat: plant.latitude,
        lng: plant.longitude,
      });
    }
  }, [plant]);

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

      <div className={styles.switchRow}>
        <div className={styles.switchLabel}>
          <span>Compartilhar localização</span>
        </div>

        <button
          className={`${styles.switch} ${shareLocation ? styles.active : ''}`}
          onClick={() => {
            if (!shareLocation) {
              setShareLocation(true);
              setIsDirty(true);
              return;
            }

            if (hasSavedLocation && !isDirty) {
              setModalType('disable-sharing');
              setShowLocationModal(true);
            } else {
              setShareLocation(false);
              setIsDirty(false);
            }
          }}
          aria-pressed={shareLocation}
        >
          <span className={styles.thumb} />
        </button>
      </div>

      {shareLocation && (
        <div className={styles.mapWrapper}>
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker
              position={position}
              setPosition={(pos) => {
                setPosition(pos);
                setIsDirty(true);
              }}
            />
          </MapContainer>
        </div>
      )}

      {shareLocation && (
        <Button
          onClick={() => {
            setModalType('confirm-location');
            setShowLocationModal(true);
          }}
          disabled={!isDirty}
        >
          Confirmar localização
        </Button>
      )}

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
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title={
          modalType === 'disable-sharing'
            ? 'Parar compartilhamento'
            : 'Confirmar localização'
        }
      >
        <p className={styles.deleteText}>
          {modalType === 'disable-sharing'
            ? 'Deseja parar de compartilhar a localização desta planta?'
            : 'Confirmar a localização selecionada?'}
        </p>

        <div className={styles.deleteActions}>
          <Button
            variant="ghost"
            onClick={() => setShowLocationModal(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              if (modalType === 'disable-sharing') {
                updateLocation.mutate({
                  plantaId,
                  data: {
                    compartilharLocalizacao: false,
                  },
                });

                setShareLocation(false);
              }

              if (modalType === 'confirm-location') {
                updateLocation.mutate({
                  plantaId,
                  data: {
                    compartilharLocalizacao: true,
                    latitude: position.lat,
                    longitude: position.lng,
                  },
                });

                setIsDirty(false);
              }

              setShowLocationModal(false);
            }}
            loading={updateLocation.isPending}
          >
            Confirmar
          </Button>
        </div>
      </Modal>

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
