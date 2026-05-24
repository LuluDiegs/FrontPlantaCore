import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState } from 'react';
import { useAllPlants } from '../hooks/usePlants';
import styles from './MapPage.module.css';

export default function MapPage() {
  const navigate = useNavigate();
  const { data: plants = [] } = useAllPlants();

  const [selectedPlant, setSelectedPlant] = useState(null);

  const plantsWithLocation = plants.filter(
    (p) => p.latitude && p.longitude
  );

  const defaultPosition = {
    lat: -23.9700,
    lng: -46.3100,
  };

  function handleMarkerClick(plant) {
    if (selectedPlant?.id === plant.id) {
      setSelectedPlant(null);
    } else {
      setSelectedPlant(plant);
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className={styles.title}>
        🌿 Explore, capture e faça parte de grandes descobertas!
      </h1>

      <div className={styles.content}>
        <div className={styles.mapWrapper}>
          <MapContainer
            center={defaultPosition}
            zoom={13}
            scrollWheelZoom
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {plantsWithLocation.map((plant) => (
              <Marker
                key={plant.id}
                position={[plant.latitude, plant.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(plant),
                }}
              />
            ))}
          </MapContainer>
        </div>

        <div className={`${styles.sidePanel} ${selectedPlant ? styles.open : styles.closed}`}>
          {selectedPlant && (
            <>
              <div className={styles.plantInfo}>
                <img
                  src={selectedPlant.fotoPlanta || '/error-loading-plant-image.jpg'}
                  alt={selectedPlant.nomeComum || ''}
                  className={styles.plantImage}
                  onError={(e) => {
                    e.currentTarget.src = '/error-loading-plant-image.jpg';
                  }}
                />

                <div className={styles.titleBlock}>
                  <h2 className={styles.plantName}>
                    {selectedPlant.nomeComum || selectedPlant.nomeCientifico}
                  </h2>

                  {selectedPlant.nomeCientifico && (
                    <span className={styles.scientific}>
                      {selectedPlant.nomeCientifico}
                    </span>
                  )}

                  <div className={styles.badges}>
                    {selectedPlant.familia && (
                      <span className={styles.badge}>🌿 {selectedPlant.familia}</span>
                    )}

                    {selectedPlant.genero && (
                      <span className={styles.badge}>🔬 {selectedPlant.genero}</span>
                    )}

                    {selectedPlant.toxica && (
                      <span className={styles.badgeDanger}>☠️ Tóxica</span>
                    )}
                  </div>

                  {selectedPlant.cuidados && (
                    <p className={styles.cuidados}>
                      {selectedPlant.cuidados}
                    </p>
                  )}
                </div>
              </div>

              {selectedPlant.usuario && (
                <div className={styles.userFooter}>
                  <div>
                    <img
                      src={selectedPlant.usuario.fotoPerfil || '/error-loading-user-image.jpg'}
                      alt={selectedPlant.usuario.nome}
                      className={styles.avatar}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />

                    <div
                      className={styles.avatarFallback}
                      style={{ display: 'none' }}
                    >
                      {selectedPlant.usuario.nome?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <strong>{selectedPlant.usuario.nome}</strong>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}