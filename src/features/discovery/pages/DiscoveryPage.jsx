import { Link } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import PostCard from '../../posts/components/PostCard';
import ComunidadeCard from '../../comunidade/components/ComunidadeCard';
import {
  useGlobalSearch,
  useRecommendedCommunities,
  useSuggestedUsers,
  useTrendingPosts,
  useUserQuickSearch,
} from '../hooks/useDiscovery';
import styles from './DiscoveryPage.module.css';

function UserCard({ user }) {
  return (
    <Link to={`/usuario/${user.id}`} className={styles.userCard}>
      <div className={styles.userAvatar}>
        {user.fotoPerfil ? <img src={user.fotoPerfil} alt={user.nome} /> : user.nome?.charAt(0)?.toUpperCase()}
      </div>
      <div>
        <strong>{user.nome}</strong>
        {user.biografia && <p>{user.biografia}</p>}
      </div>
    </Link>
  );
}

function PlantResult({ plant }) {
  const title = plant.nome || plant.nomeComum || plant.nomeCientifico || 'Planta';
  const subtitle = plant.nomeCientifico || plant.familia || plant.genero;

  return (
    <article className={styles.plantCard}>
      <div>
        <strong>{title}</strong>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {plant.id && (
        <Link to={`/planta/${plant.id}`} className={styles.inlineLink}>
          Abrir planta
        </Link>
      )}
    </article>
  );
}

export default function DiscoveryPage() {
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');

  const normalizedQuery = committedQuery.trim();
  const globalSearch = useGlobalSearch(normalizedQuery);
  const quickUsers = useUserQuickSearch(normalizedQuery);
  const trendingPosts = useTrendingPosts();
  const suggestedUsers = useSuggestedUsers();
  const recommendedCommunities = useRecommendedCommunities();

  const summary = useMemo(() => {
    const data = globalSearch.data;
    if (!data) return 0;
    return (data.usuarios?.length || 0)
      + (data.posts?.length || 0)
      + (data.comunidades?.length || 0)
      + (data.plantas?.length || 0);
  }, [globalSearch.data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCommittedQuery(query);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Busca integrada</span>
          <h1>Descobrir</h1>
          <p>Pesquisa única para usuários, posts, comunidades e plantas, usando os endpoints centrais do backend.</p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por pessoas, posts, comunidades ou plantas"
            />
          </div>
          <div className={styles.searchActions}>
            <Button type="submit">Buscar</Button>
            {normalizedQuery && (
              <Button type="button" variant="ghost" onClick={() => { setQuery(''); setCommittedQuery(''); }}>
                Limpar
              </Button>
            )}
          </div>
        </form>
      </section>

      {normalizedQuery ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Resultados</h2>
            <span>{summary} encontrados</span>
          </div>

          {globalSearch.isLoading && (
            <div className={styles.loadingBox}>
              <Spinner />
            </div>
          )}

          {!globalSearch.isLoading && summary === 0 && (
            <EmptyState
              icon={Search}
              title="Nada encontrado"
              description="Tente um nome mais amplo ou um termo diferente."
            />
          )}

          {!!quickUsers.data?.length && (
            <div className={styles.group}>
              <h3>Pessoas</h3>
              <div className={styles.userGrid}>
                {quickUsers.data.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          {!!globalSearch.data?.posts?.length && (
            <div className={styles.group}>
              <h3>Posts</h3>
              <div className={styles.postList}>
                {globalSearch.data.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {!!globalSearch.data?.comunidades?.length && (
            <div className={styles.group}>
              <h3>Comunidades</h3>
              <div className={styles.communityGrid}>
                {globalSearch.data.comunidades.map((community) => (
                  <ComunidadeCard key={community.id} comunidade={community} />
                ))}
              </div>
            </div>
          )}

          {!!globalSearch.data?.plantas?.length && (
            <div className={styles.group}>
              <h3>Plantas</h3>
              <div className={styles.plantGrid}>
                {globalSearch.data.plantas.map((plant, index) => (
                  <PlantResult key={plant.id || `${plant.nome}-${index}`} plant={plant} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2><TrendingUp size={18} /> Em alta</h2>
            </div>
            <div className={styles.postList}>
              {(trendingPosts.data || []).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2><Users size={18} /> Sugestões para seguir</h2>
            </div>
            <div className={styles.userGrid}>
              {(suggestedUsers.data || []).map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2><Sparkles size={18} /> Comunidades recomendadas</h2>
            </div>
            <div className={styles.communityGrid}>
              {(recommendedCommunities.data || []).map((community) => (
                <ComunidadeCard key={community.id} comunidade={community} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
