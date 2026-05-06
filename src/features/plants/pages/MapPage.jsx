import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import styles from './MapPage.module.css';

export default function MapPage() {
  const navigate = useNavigate();

  const defaultPosition = {
    lat: -23.9700,
    lng: -46.3100,
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={defaultPosition}
          zoom={14}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
}