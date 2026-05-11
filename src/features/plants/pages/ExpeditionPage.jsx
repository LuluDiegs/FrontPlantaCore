import { useEffect, useMemo, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Compass, Crosshair, Leaf, Loader2, MapPinned, Radar, RefreshCcw } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { useCaptureNearbyPlant, useExpeditionNearby } from '../hooks/usePlants';
import styles from './ExpeditionPage.module.css';

const DEFAULT_POSITION = { lat: -23.5505, lng: -46.6333 };
const RADIUS_OPTIONS = [0.5, 1, 2, 5];

function createMarkerIcon(className, label) {
  return divIcon({
    className: '',
    html: `<div class="${className}">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
}

function formatDistance(distance) {
  if (!Number.isFinite(distance)) return '--';
  if (distance < 1000) return `${Math.round(distance)} m`;
  return `${(distance / 1000).toFixed(1)} km`;
}

function rarityLabel(rarity) {
  if (rarity === 'Rara') return 'rara';
  if (rarity === 'Incomum') return 'incomum';
  return 'comum';
}

export default function ExpeditionPage() {
  const [radiusKm, setRadiusKm] = useState(2);
  const [position, setPosition] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [geoError, setGeoError] = useState('');

  const capturePlant = useCaptureNearbyPlant();
  const expedition = useExpeditionNearby({
    latitude: position?.lat,
    longitude: position?.lng,
    raioKm: radiusKm,
    limite: 40,
  });

  const currentIcon = useMemo(
    () => createMarkerIcon(styles.currentMarker, '<span></span>'),
    []
  );

  const nearbyIcon = useMemo(
    () => createMarkerIcon(styles.nearbyMarker, '<span></span>'),
    []
  );

  const plants = expedition.data?.plantas ?? [];
  const summary = expedition.data ?? {};
  const captureRange = summary.alcanceCapturaMetros ?? 150;

  const refreshLocation = () => {
    setGeoStatus('loading');
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoError('Seu navegador nao suporta geolocalizacao.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (coords) => {
        setPosition({
          lat: coords.coords.latitude,
          lng: coords.coords.longitude,
        });
        setGeoStatus('ready');
      },
      () => {
        setGeoStatus('error');
        setGeoError('Nao foi possivel acessar sua localizacao. Ative o GPS e tente de novo.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <Radar size={16} />
            Planta GO
          </span>
          <h1>Cace especies perto de voce e transforme a rua em jardim</h1>
          <p>
            Plantas compartilhadas por outros usuarios aparecem no radar. Chegue perto,
            capture a especie e leve uma nova descoberta para a sua colecao.
          </p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span>Spawns agora</span>
            <strong>{summary.total ?? 0}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Novas especies</span>
            <strong>{summary.novasEspecies ?? 0}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Raio de captura</span>
            <strong>{captureRange} m</strong>
          </div>
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.radiusGroup}>
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.radiusChip} ${radiusKm === option ? styles.radiusChipActive : ''}`}
              onClick={() => setRadiusKm(option)}
            >
              {option} km
            </button>
          ))}
        </div>

        <div className={styles.controlActions}>
          <Button
            variant="secondary"
            onClick={refreshLocation}
            disabled={geoStatus === 'loading'}
          >
            {geoStatus === 'loading' ? <Loader2 size={16} /> : <Crosshair size={16} />}
            Atualizar posicao
          </Button>
          <Button
            variant="ghost"
            onClick={() => expedition.refetch()}
            disabled={expedition.isFetching}
          >
            <RefreshCcw size={16} />
            Recarregar mapa
          </Button>
        </div>
      </section>

      {geoError && <p className={styles.geoError}>{geoError}</p>}

      <section className={styles.mapCard}>
        <div className={styles.mapHeader}>
          <div>
            <h2>Radar botanico</h2>
            <p>Seu ponto atual fica no centro da busca. Quanto mais perto, maior a chance de captura.</p>
          </div>
          <span className={styles.mapPill}>
            <MapPinned size={16} />
            {formatDistance(captureRange)}
          </span>
        </div>

        <div className={styles.mapWrapper}>
          <MapContainer
            center={position ?? DEFAULT_POSITION}
            zoom={15}
            scrollWheelZoom
            className={styles.map}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <RecenterMap center={position} />}
            {position && (
              <Marker position={position} icon={currentIcon}>
                <Popup>Voce esta aqui.</Popup>
              </Marker>
            )}
            {position && (
              <Circle
                center={position}
                radius={captureRange}
                pathOptions={{ color: '#f9c74f', fillColor: '#f9c74f', fillOpacity: 0.12 }}
              />
            )}
            {plants.map((plant) => (
              <Marker
                key={plant.id}
                position={{ lat: plant.latitude, lng: plant.longitude }}
                icon={nearbyIcon}
              >
                <Popup>
                  <strong>{plant.nomeComum || plant.nomeCientifico}</strong>
                  <br />
                  {formatDistance(plant.distanciaMetros)} de distancia
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <div>
            <h2>Plantas proximas</h2>
            <p>Use o mapa para explorar e a lista para capturar rapido.</p>
          </div>
        </div>

        {(expedition.isLoading || geoStatus === 'loading') && (
          <div className={styles.loadingWrap}>
            <Spinner />
          </div>
        )}

        {!expedition.isLoading && geoStatus !== 'loading' && !plants.length && (
          <EmptyState
            icon={Compass}
            title="Nada encontrado por aqui"
            description="Ajuste o raio ou compartilhe a localizacao das suas plantas para povoar o mapa."
            action={<Button onClick={refreshLocation}>Tentar novamente</Button>}
          />
        )}

        {plants.length > 0 && (
          <div className={styles.cardGrid}>
            {plants.map((plant) => {
              const canCapture = plant.disponivelParaCaptura && !plant.jaColecionada;
              return (
                <article key={plant.id} className={styles.plantCard}>
                  <div className={styles.cardImageWrap}>
                    {plant.fotoPlanta ? (
                      <img src={plant.fotoPlanta} alt={plant.nomeComum || plant.nomeCientifico} className={styles.cardImage} />
                    ) : (
                      <div className={styles.cardPlaceholder}>
                        <Leaf size={28} />
                      </div>
                    )}
                    <span className={`${styles.rarityBadge} ${styles[`rarity${plant.raridade}`] || ''}`}>
                      {rarityLabel(plant.raridade)}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div>
                      <h3>{plant.nomeComum || plant.nomeCientifico}</h3>
                      <p>{plant.nomeComum ? plant.nomeCientifico : plant.familia || 'Especie compartilhada pela comunidade'}</p>
                    </div>

                    <div className={styles.metaList}>
                      <span>{formatDistance(plant.distanciaMetros)}</span>
                      <span>{plant.donoNome ? `por ${plant.donoNome}` : 'comunidade'}</span>
                    </div>

                    {plant.jaColecionada ? (
                      <div className={styles.statusBox}>
                        Essa especie ja esta no seu jardim.
                      </div>
                    ) : (
                      <div className={styles.statusBox}>
                        {canCapture
                          ? 'Voce esta no alcance ideal para capturar agora.'
                          : `Chegue a ${captureRange} m para capturar.`}
                      </div>
                    )}

                    <Button
                      onClick={() => capturePlant.mutate({
                        plantaId: plant.id,
                        latitude: position?.lat,
                        longitude: position?.lng,
                      })}
                      disabled={!canCapture || !position || capturePlant.isPending}
                      loading={capturePlant.isPending}
                    >
                      Capturar planta
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
