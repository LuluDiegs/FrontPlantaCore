import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flower2, Camera, MapPin, X } from 'lucide-react';
import { useCreatePost } from '../hooks/usePosts';
import { useMyPlants, useSearchMyPlants } from '../../plants/hooks/usePlants';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import styles from './CreatePostForm.module.css';

const postSchema = z.object({
  conteudo: z.string().min(1, 'Escreva algo no seu post').max(5000),
});

export default function CreatePostForm() {
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [plantsPage, setPlantsPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [term, setTerm] = useState('');

  const [foto, setFoto] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [carregandoLocal, setCarregandoLocal] = useState(false);

  const { data: plantsData, isLoading: plantsLoading } = useMyPlants(plantsPage);
  const { data: searchData, isLoading: searching } = useSearchMyPlants(term, searchPage);
  const createPost = useCreatePost();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
  });

  const plants = (term ? (searchData?.itens || []) : (plantsData?.itens || []));

  useEffect(() => { 
    setSearchPage(1); 
  }, [term]);

  useEffect(() => {
    const t = setTimeout(() => {}, 200);
    return () => clearTimeout(t);
  }, [term]);

  const handleCapturePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFoto(event.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    setCarregandoLocal(true);
    
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.");
      setCarregandoLocal(false);
      return;
    }

    // PEGA AS COORDENADAS NA MEMORIIIIA
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocalizacao({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCarregandoLocal(false);
      },
      (error) => {
        console.error("Erro ao pegar localização:", error);
        alert("Não foi possível acessar sua localização. Verifique o GPS.");
        setCarregandoLocal(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // REMOVE A LOC SE O USUARIO DESISTIR
  const handleRemoveLocation = () => {
    setLocalizacao(null);
  };

  // --- ENVIO DO FORMULÁRIO ---
  const onSubmit = (data) => {
    const payload = { 
      conteudo: data.conteudo,
      //SE TIVER A LOC SALVA ELE MANDA, SE NÃO TIVER MANDA NULL !!!!!.
      localizacao: localizacao 
    };
    
    if (foto) payload.foto = foto; 
    if (selectedPlantId) payload.plantaId = selectedPlantId;
    
    createPost.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      
      <div className={styles.plantPicker}>
        <label className={styles.label}>
          <Flower2 size={16} />
          Selecione uma planta
        </label>

        {(plantsLoading || searching) && <Spinner size="sm" />}

        <div className={styles.searchRow}>
          <input
            placeholder="Pesquisar minhas plantas..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className={styles.searchInput}
          />
          {term && (
            <button type="button" className={styles.clearBtn} onClick={() => setTerm('')}>Limpar</button>
          )}
        </div>

        {!plantsLoading && !plants.length && (
          <p className={styles.hint}>
            Você ainda não tem plantas salvas — é possível publicar sem associar uma planta.
          </p>
        )}

        {plants.length > 0 && (
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
                  <div className={styles.plantPlaceholder}>
                    <Flower2 size={16} />
                  </div>
                )}
                <span>{plant.nomeComum || plant.nomeCientifico}</span>
              </button>
            ))}
          </div>
        )}

        {term ? (
          searchData?.temProxima ? (
            <div className={styles.loadMoreWrap}>
              <button type="button" className={styles.loadMoreBtn} onClick={() => setSearchPage((p) => p + 1)}>Carregar mais</button>
            </div>
          ) : null
        ) : (
          plantsData?.temProxima ? (
            <div className={styles.loadMoreWrap}>
              <button type="button" className={styles.loadMoreBtn} onClick={() => setPlantsPage((p) => p + 1)}>Carregar mais</button>
            </div>
          ) : null
        )}

        {!selectedPlantId && plants.length > 0 && (
          <p className={styles.hint}>Escolha a planta relacionada ao post</p>
        )}
      </div>

      {/*FOTO E LOCALIZAÇÃO OPCIONAL!!!!!! */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        
        <div>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            padding: '12px', backgroundColor: '#f0fdf4', color: '#166534',
            borderRadius: '8px', border: '1px dashed #166534', fontWeight: '500'
          }}>
            <Camera size={20} />
            {foto ? 'Trocar Foto' : 'Adicionar Foto (Opcional)'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapturePhoto}
              style={{ display: 'none' }}
            />
          </label>
          {foto && <p style={{ fontSize: '12px', color: '#166534', marginTop: '4px', textAlign: 'center' }}>📸 {foto.name}</p>}
        </div>

        {/* CONTROLE DE LOCALIZAÇÃO OPCIONAL */}
        <div>
          {!localizacao ? (
            //SE NÃO TIVER A LOC, MOSTRA A OPÇÃO DE BUSCAR!!!!!
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={carregandoLocal}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: carregandoLocal ? 'not-allowed' : 'pointer',
                padding: '12px', backgroundColor: '#f3f4f6', color: '#374151',
                borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', fontWeight: '500',
                opacity: carregandoLocal ? 0.7 : 1
              }}
            >
              <MapPin size={20} />
              {carregandoLocal ? 'Buscando satélites...' : '📍 Compartilhar minha localização'}
            </button>
          ) : (
            // SE TIVER A LOCALIZAÇÃO AQUI VAI MOSTRAR QUE FUNFOU EM !!!!
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', backgroundColor: '#e0f2fe', color: '#0369a1',
              borderRadius: '8px', border: '1px solid #bae6fd', width: '100%', fontWeight: '500'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} />
                Localização anexada!
              </span>
              <button
                type="button"
                onClick={handleRemoveLocation}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', 
                  fontSize: '14px', cursor: 'pointer', background: 'none', border: 'none' 
                }}
              >
                <X size={16} /> Remover
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AQUI FICA OS TEXTO DOS POSTS!!!!!! */}
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
        disabled={createPost.isPending}
      >
        Publicar
      </Button>
      
    </form>
  );
}