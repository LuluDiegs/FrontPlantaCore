import { useMemo, useState } from 'react';
import { Search, Sparkles, Users, Plus } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import ComunidadeCard from '../components/ComunidadeCard';
import ComunidadeTabs from '../components/ComunidadeTabs';
import {
  useBuscarComunidades,
  useComunidades,
  useCreateComunidade,
  useDeleteComunidade,
  useJoinComunidade,
  useLeaveComunidade,
  useMinhasComunidades,
} from '../hooks/useComunidade';
import styles from './ComunidadesPage.module.css';

function normalizeList(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.itens)) return data.itens;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.resultado)) return data.resultado;

  if (Array.isArray(data?.dados?.items)) return data.dados.items;
  if (Array.isArray(data?.dados?.itens)) return data.dados.itens;
  if (Array.isArray(data?.dados?.data)) return data.dados.data;

  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.itens)) return data.data.itens;
  if (Array.isArray(data?.data?.dados)) return data.data.dados;

  if (Array.isArray(data?.resultado?.items)) return data.resultado.items;
  if (Array.isArray(data?.resultado?.itens)) return data.resultado.itens;

  return [];
}

function getComunidadeId(comunidade) {
  return String(
    comunidade?.id ??
      comunidade?.comunidadeId ??
      comunidade?.idComunidade ??
      ''
  );
}

function isParticipando(comunidade, activeTab, minhasIds) {
  if (activeTab === 'minhas') return true;

  const backendFlag = Boolean(
    comunidade?.participando ??
      comunidade?.ehMembro ??
      comunidade?.isMember ??
      comunidade?.membro
  );

  if (backendFlag) return true;

  const id = getComunidadeId(comunidade);
  return minhasIds.has(id);
}

function isOwner(comunidade) {
  return Boolean(
    comunidade?.souCriador ??
      comunidade?.isOwner ??
      comunidade?.ehCriador ??
      comunidade?.criador ??
      comunidade?.owner
  );
}

export default function ComunidadesPage() {
  const [activeTab, setActiveTab] = useState('todas');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ nome: '', descricao: '' });

  const comunidadesQuery = useComunidades();
  const minhasQuery = useMinhasComunidades();
  const buscarQuery = useBuscarComunidades(activeTab === 'buscar' ? search : '');
  const createMutation = useCreateComunidade();
  const joinMutation = useJoinComunidade();
  const leaveMutation = useLeaveComunidade();
  const deleteMutation = useDeleteComunidade();

  const comunidades = useMemo(
    () => normalizeList(comunidadesQuery.data),
    [comunidadesQuery.data]
  );

  const minhasComunidades = useMemo(
    () => normalizeList(minhasQuery.data),
    [minhasQuery.data]
  );

  const comunidadesBusca = useMemo(
    () => normalizeList(buscarQuery.data),
    [buscarQuery.data]
  );

  const minhasIds = useMemo(() => {
    return new Set(minhasComunidades.map((item) => getComunidadeId(item)));
  }, [minhasComunidades]);

  const loading =
    (activeTab === 'todas' && comunidadesQuery.isLoading) ||
    (activeTab === 'minhas' && minhasQuery.isLoading) ||
    (activeTab === 'buscar' && buscarQuery.isLoading);

  const activeList =
    activeTab === 'minhas'
      ? minhasComunidades
      : activeTab === 'buscar'
      ? comunidadesBusca
      : comunidades;

  const heroText =
    activeTab === 'minhas'
      ? 'Acompanhe os espaços que você já participa.'
      : activeTab === 'buscar'
      ? 'Encontre pessoas com os mesmos interesses nas plantas que você ama.'
      : 'Descubra comunidades para trocar dicas, cuidados, mudas e experiências.';

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.descricao.trim()) return;

    await createMutation.mutateAsync({
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
    });

    setForm({ nome: '', descricao: '' });
    setActiveTab('todas');
  };

  const handleAction = (comunidade, participating) => {
    const comunidadeId = getComunidadeId(comunidade);

    if (participating) {
      if (isOwner(comunidade)) {
        const confirmDelete = window.confirm(
          'Você criou essa comunidade.\n\nDeseja apagá-la?'
        );

        if (confirmDelete) {
          deleteMutation.mutate(comunidadeId);
        }

        return;
      }

      leaveMutation.mutate(comunidadeId);
      return;
    }

    joinMutation.mutate(comunidadeId);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>
            <Sparkles size={16} /> Comunidades
          </span>

          <h1>Seu cantinho verde dentro da rede</h1>
          <p>{heroText}</p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Users size={18} />
            <div>
              <strong>{comunidades.length || 0}</strong>
              <span>comunidades</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <Plus size={18} />
            <div>
              <strong>{minhasComunidades.length || 0}</strong>
              <span>minhas</span>
            </div>
          </div>
        </div>
      </section>

      <ComunidadeTabs active={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'buscar' && (
        <div className={styles.searchBox}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busque por suculentas, orquídeas, jardinagem..."
            icon={Search}
          />
        </div>
      )}

      {activeTab === 'criar' && (
        <section className={styles.createCard}>
          <div className={styles.createHeader}>
            <h2>Criar nova comunidade</h2>
            <p>
              Monte um espaço para reunir pessoas que gostam do mesmo tipo de
              planta ou assunto.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleCreate}>
            <Input
              label="Nome da comunidade"
              value={form.nome}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nome: e.target.value }))
              }
              placeholder="Ex: Apaixonados por suculentas"
            />

            <div className={styles.textareaGroup}>
              <label>Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, descricao: e.target.value }))
                }
                placeholder="Fale sobre o objetivo da comunidade, o que as pessoas vão encontrar e trocar por aqui."
                rows={5}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" loading={createMutation.isPending}>
                Criar comunidade
              </Button>
            </div>
          </form>
        </section>
      )}

      {activeTab !== 'criar' && loading && (
        <div className={styles.loadingBox}>
          <Spinner />
        </div>
      )}

      {activeTab !== 'criar' && !loading && activeList.length === 0 && (
        <EmptyState
          title={
            activeTab === 'buscar'
              ? 'Nenhum resultado encontrado'
              : 'Nenhuma comunidade encontrada'
          }
          description={
            activeTab === 'buscar'
              ? 'Tente buscar por outro termo para encontrar comunidades.'
              : 'Crie ou descubra comunidades relacionadas às suas plantas.'
          }
        />
      )}

      {activeTab !== 'criar' && !loading && activeList.length > 0 && (
        <div className={styles.list}>
          {activeList.map((comunidade) => {
            const participating = isParticipando(
              comunidade,
              activeTab,
              minhasIds
            );

            return (
              <ComunidadeCard
                key={getComunidadeId(comunidade)}
                comunidade={comunidade}
                actionLabel={participating ? 'Sair' : 'Entrar'}
                actionLoading={
                  joinMutation.isPending ||
                  leaveMutation.isPending ||
                  deleteMutation.isPending
                }
                onAction={() => handleAction(comunidade, participating)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}