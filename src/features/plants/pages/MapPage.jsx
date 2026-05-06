import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState } from 'react';
import { useAllPlants } from '../hooks/usePlants';
import styles from './MapPage.module.css';

export default function MapPage() {
  const navigate = useNavigate();
  const { data: plants = [], isLoading } = useAllPlants();

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
      <h1 className={styles.title}>
        🌿 Explore, capture e faça parte de grandes descobertas!
      </h1>

      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className={styles.container}>
        <div className={styles.mapWrapper}>
          <MapContainer
            center={defaultPosition}
            zoom={13}
            scrollWheelZoom
            className={styles.map}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {plantsWithLocation.map((plant, index) => (
              <Marker
                key={plant.id}
                position={[plant.latitude, plant.longitude]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div class="marker-dot" style="animation-delay:${index * 0.05}s">🌱</div>`,
                })}
                eventHandlers={{
                  click: () => handleMarkerClick(plant),
                }}
              />
            ))}
          </MapContainer>
        </div>

        {selectedPlant && (
          <div className={styles.sidePanel}>
            {selectedPlant.fotoPlanta && (
              <img
                src={selectedPlant.fotoPlanta}
                alt={selectedPlant.nomeComum}
                className={styles.plantImage}
              />
            )}

            <h2>
              {selectedPlant.nomeComum ||
                selectedPlant.nomeCientifico}
            </h2>

            {selectedPlant.familia && (
              <p><strong>Família:</strong> {selectedPlant.familia}</p>
            )}

            {selectedPlant.usuario && (
              <div className={styles.userBox}>
                {selectedPlant.usuario.fotoPerfil &&
                  selectedPlant.usuario.fotoPerfil.trim() !== '' && (
                    <img
                      src={selectedPlant.usuario.fotoPerfil}
                      alt="Perfil"
                      className={styles.avatar}
                    />
                  )}

                <div>
                  <strong>{selectedPlant.usuario.nome}</strong>

                  {selectedPlant.usuario.biografia &&
                    selectedPlant.usuario.biografia.trim() !== '' && (
                      <p className={styles.bio}>
                        {selectedPlant.usuario.biografia}
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
