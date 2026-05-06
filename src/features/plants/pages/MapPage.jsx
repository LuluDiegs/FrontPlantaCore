import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMyPlants } from '../hooks/usePlants';
import styles from './MapPage.module.css';

export default function MapPage() {
  const navigate = useNavigate();
	const { data, isLoading } = useMyPlants(1);

	const plants = data?.itens ?? [];

	const plantsWithLocation = plants.filter((p) => 
		p.latitude &&
		p.longitude
	);
 
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
					zoom={13}
					scrollWheelZoom={true}
					className={styles.map}
				>
				<TileLayer
					attribution="&copy; OpenStreetMap contributors"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{plantsWithLocation.map((plant) => (
					<Marker
						key={plant.id}
						position={[plant.latitude, plant.longitude]}
					>
					<Popup>
					<strong>{plant.nomeComum || plant.nomeCientifico}</strong>
					<br />
						{plant.familia && <span>Família: {plant.familia}</span>}
					</Popup>
					</Marker>
				))}
				</MapContainer>
      </div>
    </div>
  );
}