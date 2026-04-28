import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Camera, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMyPlants } from '../hooks/usePlants';
import { useSearchMyPlants } from '../hooks/usePlants';
import { useGenerateCareRemindersForAll } from '../hooks/useReminders';
import PlantCard from '../components/PlantCard';
import { SkeletonCard } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Button from '../../../shared/components/ui/Button';
import styles from './MyPlantsPage.module.css';

export default function MyPlantsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const generateAllReminders = useGenerateCareRemindersForAll();
  const { data, isLoading, refetch } = useMyPlants(page);
  const { data: searchData, isLoading: isSearching, refetch: refetchSearch } = useSearchMyPlants(debouncedTerm, searchPage);

  // Auto-refetch quando volta para página (garante que plantas adicionadas apareçam)
  useEffect(() => {
    refetch();
  }, [page, refetch]);

  // Debounce search input to avoid flooding requests
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // While searching, keep showing previous items until new results arrive to avoid layout jumps
  let plants = [];
  let totalPages = 1;

  if (searchTerm) {
    plants = searchData?.itens ?? (isSearching ? (data?.itens ?? []) : []);
    totalPages = searchData?.totalPaginas ?? (isSearching ? (data?.totalPaginas ?? 1) : 1);
  } else {
    plants = data?.itens ?? [];
    totalPages = data?.totalPaginas ?? 1;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Minhas Plantas</h1>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => generateAllReminders.mutate()}
            loading={generateAllReminders.isPending}
          >
            Gerar lembretes
          </Button>
          <Link to="/identificar">
            <Button variant="secondary" size="sm">
              <Camera size={16} /> Identificar
            </Button>
          </Link>
          <Link to="/buscar-planta">
            <Button variant="secondary" size="sm">
              <Search size={16} /> Buscar
            </Button>
          </Link>
        </div>
      </div>

      {(isLoading || isSearching) && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      <div className={styles.searchWrap}>
        <div className={styles.searchInputWrap}>
          <Search size={16} />
          <input
            className={styles.searchInput}
            placeholder="Pesquisar nas minhas plantas"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setSearchPage(1); }}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSearchPage(1); refetch(); }}>
            Limpar
          </Button>
        )}
      </div>

      {!isLoading && !isSearching && !plants.length && (
        <EmptyState
          icon={Flower2}
          title={searchTerm ? 'Nenhuma planta encontrada' : 'Nenhuma planta ainda'}
          description={searchTerm ? 'Não encontramos plantas com esse termo na sua coleção' : 'Identifique ou busque plantas para começar sua coleção'}
          action={
            searchTerm ? (
              <Button onClick={() => { setSearchTerm(''); setSearchPage(1); refetch(); }}>
                Limpar busca
              </Button>
            ) : (
              <Link to="/identificar">
                <Button><Camera size={16} /> Identificar minha primeira planta</Button>
              </Link>
            )
          }
        />
      )}

      {plants.length > 0 && (
        <>
          <div className={styles.gridWrap}>
            <div className={styles.grid}>
              {plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} highlight={debouncedTerm} />
              ))}
            </div>

            {isSearching && (
              <div className={styles.searchOverlay} aria-hidden>
                <div className={styles.overlayContent}>Atualizando...</div>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={18} />
              </button>
              <span className={styles.pageInfo}>{page} de {totalPages}</span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
