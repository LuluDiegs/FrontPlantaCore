

import { Link } from 'react-router-dom';
import { PenSquare, Compass, Rss, Clock, Heart, MessageSquare } from 'lucide-react';
import { useFeed, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Spinner from '../../../shared/components/ui/Spinner';
import Button from '../../../shared/components/ui/Button';
import useInfiniteScroll from '../../../shared/hooks/useInfiniteScroll';
import styles from './FeedPage.module.css';
import { useState, useEffect } from 'react';
import { useSearchFeed } from '../hooks/usePosts';


export default function FeedPage() {
  // Filtros aceitos pelo backend
  const ORDER_OPTIONS = [
    { value: 'mais_recente', label: 'Mais recentes', icon: Clock },
    { value: 'mais_curtido', label: 'Mais curtidos', icon: Heart },
    { value: 'mais_comentado', label: 'Mais comentados', icon: MessageSquare },
    { value: 'mais_antigo', label: 'Mais antigos', icon: null },
  ];
  const [ordenarPor, setOrdenarPor] = useState('mais_recente');
  const [localKey, setLocalKey] = useState(0); // força reset do infiniteQuery

  // Sempre que ordenarPor mudar, reseta a query
  useEffect(() => {
    setLocalKey((k) => k + 1);
  }, [ordenarPor]);

  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeed({ ordenarPor, key: localKey });

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState(query);
  const [mode, setMode] = useState('auto'); // auto | hashtag | categoria | palavra

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // derive search params based on selected mode and input
  const searchParams = {};
  const q = debounced || '';
  if (q) {
    if (mode === 'hashtag') {
      searchParams.hashtag = q.startsWith('#') ? q.slice(1) : q;
    } else if (mode === 'categoria') {
      searchParams.categoria = q.toLowerCase().startsWith('cat:') ? q.slice(4).trim() : q;
    } else if (mode === 'palavra') {
      searchParams.palavraChave = q;
    } else {
      // auto heuristics: prefer explicit markers
      if (q.startsWith('#')) searchParams.hashtag = q.slice(1);
      else if (q.toLowerCase().startsWith('cat:')) searchParams.categoria = q.slice(4).trim();
      else searchParams.palavraChave = q;
    }
  }

  // pass backend sort to search as well
  const {
    data: searchPosts,
    isLoading: isSearching,
    hasNextPage: hasNextSearchPage,
    fetchNextPage: fetchNextSearchPage,
    isFetchingNextPage: isFetchingNextSearch,
  } = useSearchFeed({ mode, q: debounced, hashtag: searchParams.hashtag, categoria: searchParams.categoria, palavraChave: searchParams.palavraChave, usuarioId: searchParams.usuarioId, comunidadeId: searchParams.comunidadeId, ordenarPor });

  const deletePost = useDeletePost();
  const activeFetchNext = debounced ? fetchNextSearchPage : fetchNextPage;
  const activeHasNext = debounced ? hasNextSearchPage : hasNextPage;
  const activeIsFetchingNext = debounced ? isFetchingNextSearch : isFetchingNextPage;
  const { ref } = useInfiniteScroll({ fetchNextPage: activeFetchNext, hasNextPage: activeHasNext, isFetchingNextPage: activeIsFetchingNext });

  const displayed = debounced ? (searchPosts || []) : (posts || []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Feed</h1>
        <div className={styles.headerActions}>
          <div className={styles.sortWrap} aria-label="Ordenar posts">
            <div className={styles.sortButtons} role="tablist" aria-label="Ordenar posts">
              {ORDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  role="tab"
                  aria-pressed={ordenarPor === opt.value}
                  title={opt.label}
                  className={
                    styles.sortBtn + (ordenarPor === opt.value ? ' ' + styles.active : '')
                  }
                  onClick={() => setOrdenarPor(opt.value)}
                >
                  {opt.icon ? (
                    <opt.icon className={styles.sortIcon} />
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 700 }}></span>
                  )}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Link to="/salvos">
            <Button size="sm" variant="ghost">Salvos</Button>
          </Link>
          <Link to="/criar-post">
            <Button size="sm">
              <PenSquare size={16} />
              Novo post
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          className={styles.search}
          placeholder="Buscar posts — use #tag, cat:categoria ou texto livre"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.filters} role="tablist" aria-label="Modo de busca">
          <button
            type="button"
            className={`${styles.filterBtn} ${mode === 'auto' ? styles.active : ''}`}
            onClick={() => setMode('auto')}
          >
            Automático
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${mode === 'hashtag' ? styles.active : ''}`}
            onClick={() => setMode('hashtag')}
          >
            Hashtag
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${mode === 'categoria' ? styles.active : ''}`}
            onClick={() => setMode('categoria')}
          >
            Categoria
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${mode === 'palavra' ? styles.active : ''}`}
            onClick={() => setMode('palavra')}
          >
            Texto
          </button>
          <button type="button" className={styles.clearBtn} onClick={() => { setQuery(''); setDebounced(''); }}>
            Limpar
          </button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.list}>
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </div>
      )}

      {!isLoading && !debounced && (!posts || posts.length === 0) && (
        <EmptyState
          icon={Rss}
          title="Seu feed está vazio"
          description="Siga outros usuários ou explore posts públicos para começar"
          action={
            <Link to="/explorar">
              <Button variant="secondary">
                <Compass size={16} /> Explorar
              </Button>
            </Link>
          }
        />
      )}

      <div className={styles.meta}>
        {debounced && <div className={styles.resultsCount}>{(displayed || []).length} resultados</div>}
        {debounced && !(displayed || []).length && !isSearching && <div className={styles.noResults}>Nenhum post encontrado para sua busca.</div>}
      </div>

      <div className={styles.list}>
        {(displayed || []).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={(id) => deletePost.mutate(id)}
          />
        ))}
      </div>

      {(debounced ? isFetchingNextSearch : isFetchingNextPage) && <Spinner size="sm" />}
      <div ref={ref} />
    </div>
  );
}

