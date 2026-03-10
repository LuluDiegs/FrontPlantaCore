import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useSearchPlants, useAddPlantFromSearch } from '../hooks/usePlants';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import styles from './SearchPlantPage.module.css';

function AnalyzingZone({ plant }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
      <motion.div
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Spinner />
        <h2 style={{ marginTop: '20px', fontSize: '18px', fontWeight: '600' }}>Analisando planta...</h2>
        {plant?.nomeComum && (
          <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>{plant.nomeComum}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SearchPlantPage() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPlants, setAllPlants] = useState([]);
  const [analyzingPlant, setAnalyzingPlant] = useState(null);

  const search = useSearchPlants();
  const addPlant = useAddPlantFromSearch();

  const results = search.data?.sucesso ? search.data.dados : null;
  const plants = results?.plantas || [];
  const pagination = results?.paginacao;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCurrentPage(1);
    setAllPlants([]);
    search.mutate({ nomePlanta: query.trim(), pagina: 1 });
  };

  // Carrega página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setAllPlants([]);
      search.mutate({ nomePlanta: query.trim(), pagina: newPage });
    }
  };

  // Carrega próxima página (acumula resultados)
  const loadMoreResults = () => {
    if (pagination && currentPage < pagination.totalPaginas) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // NÃO reseta allPlants aqui - vai acumular
      search.mutate({ nomePlanta: query.trim(), pagina: nextPage });
    }
  };

  // Acumula plantas quando recebe novos resultados
  useEffect(() => {
    if (search.isSuccess && plants.length > 0 && query) {
      // Usa um Set para evitar duplicatas baseado no ID da planta + página
      setAllPlants((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newPlants = plants.filter((p) => !ids.has(p.id));
        return [...prev, ...newPlants];
      });
    }
  }, [plants, search.isSuccess, query]);

  const displayPlants = allPlants.length > 0 ? allPlants : plants;

  const handleAdd = (plant) => {
    setAnalyzingPlant(plant);
    addPlant.mutate(
      {
        plantaTrefleId: plant.id,
        nomeCientifico: plant.nomeCientifico || plant.nomeComum,
        urlImagem: plant.urlImagem || '',
      },
      {
        onSuccess: () => setAnalyzingPlant(null),
        onError: () => setAnalyzingPlant(null),
      }
    );
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Buscar Planta</h1>
      <p className={styles.subtitle}>Pesquise por nome comum ou científico</p>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <Input
          placeholder="Ex: rosa, samambaia, monstera..."
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" loading={search.isPending}>
          Buscar
        </Button>
      </form>

      {search.isPending && <Spinner />}

      <AnimatePresence>
        {analyzingPlant && <AnalyzingZone key="analyzing" plant={analyzingPlant} />}
      </AnimatePresence>

      {search.isSuccess && !displayPlants.length && plants.length === 0 && (
        <EmptyState
          icon={Search}
          title="Nenhum resultado"
          description="Tente buscar com outro nome ou termo"
        />
      )}

      {displayPlants.length > 0 && (
        <>
          <div className={styles.results}>
            {displayPlants.map((plant) => (
              <div key={plant.id} className={styles.resultCard}>
                <div className={styles.resultImage}>
                  {plant.urlImagem ? (
                    <img src={plant.urlImagem} alt={plant.nomeComum} loading="lazy" />
                  ) : (
                    <div className={styles.noImage}>Sem foto</div>
                  )}
                </div>

                <div className={styles.resultInfo}>
                  <h3>{plant.nomeComum || plant.nomeCientifico}</h3>
                  {plant.nomeCientifico && (
                    <span className={styles.scientific}>{plant.nomeCientifico}</span>
                  )}
                  {plant.familia && (
                    <span className={styles.family}>Família: {plant.familia}</span>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAdd(plant)}
                  loading={addPlant.isPending}
                  disabled={addPlant.isPending}
                >
                  <Plus size={16} />
                  Adicionar
                </Button>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPaginas > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <span className={styles.pageInfo}>
                Página {currentPage} de {pagination.totalPaginas} ({displayPlants.length} plantas)
              </span>

              <Button
                onClick={loadMoreResults}
                disabled={currentPage >= pagination.totalPaginas || search.isPending}
                loading={search.isPending}
                variant="secondary"
              >
                <MoreHorizontal size={16} />
                Carregar Mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
