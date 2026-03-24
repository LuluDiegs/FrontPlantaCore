import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, Send } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import CriarPostComunidade from '../../posts/components/CriarPostComunidade';
import FeedComunidade from '../../posts/components/FeedComunidade';
import {
  useComunidadeById,
  useComunidadePosts,
  useJoinComunidade,
  useMinhasComunidades,
  useUpdateComunidade,
  useDeleteComunidade,
  useSolicitarEntrada,
  useAdmins,
} from '../hooks/useComunidade';
import styles from './ComunidadeDetailPage.module.css';
import ComunidadeMembros from '../components/ComunidadeMembros';
import ComunidadeSolicitacoes from '../components/ComunidadeSolicitacoes';
import ConfirmModal from '../../../shared/components/ui/ConfirmModal';
import { useAuthStore } from '../../auth/stores/authStore';

function AdminSection({ comunidadeId, comunidade }) {
  const adminsQuery = useAdmins(comunidadeId);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const updateMutation = useUpdateComunidade();
  const deleteMutation = useDeleteComunidade();

  // Keep state hooks at top level so hook order doesn't change between renders
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const admins = adminsQuery.data || [];
  const isAdminByBackend = Boolean(
    comunidade?.ehAdmin || comunidade?.isAdmin || comunidade?.admin || comunidade?.souAdmin
  );

  const isAdmin = isAdminByBackend || admins.some((a) => String(a?.id || a?.usuarioId) === String(currentUserId));

  if (!isAdmin) return null;
  const handleTogglePrivacy = () => {
    const novaPrivada = !Boolean(comunidade?.privada ?? comunidade?.isPrivate ?? comunidade?.privada);
    updateMutation.mutate({ comunidadeId, payload: { privada: novaPrivada } });
  };

  const handleDelete = () => setConfirmDeleteOpen(true);

  const doDelete = () => {
    deleteMutation.mutate(comunidadeId);
    setConfirmDeleteOpen(false);
  };

  return (
    <section className={styles.adminSection}>
      <div className={styles.adminColumn}>
        <div className={styles.adminControls}>
          <ComunidadeSolicitacoes comunidadeId={comunidadeId} />

          <div className={styles.adminActions}>
            <Button variant="ghost" onClick={handleTogglePrivacy} loading={updateMutation.isLoading}>
              {comunidade?.privada || comunidade?.isPrivate ? 'Tornar pública' : 'Tornar privada'}
            </Button>

            <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isLoading}>
              Excluir comunidade
            </Button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmDeleteOpen}
        title="Excluir comunidade"
        description="Tem certeza que deseja excluir esta comunidade? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={doDelete}
        loading={deleteMutation.isLoading}
      />
    </section>
  );
}

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

export default function ComunidadeDetailPage() {
  const { comunidadeId } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreate, setShowCreate] = useState(false);
  const [sortMode, setSortMode] = useState('recent');

  const sortMap = {
    recent: 'mais_recente',
    liked: 'mais_curtido',
    commented: 'mais_comentado',
    oldest: 'mais_antigo',
  };

  const backendOrdenarPor = sortMap[sortMode] || 'mais_recente';
  

  const comunidadeQuery = useComunidadeById(comunidadeId);
  const postsQuery = useComunidadePosts(comunidadeId);
  const minhasQuery = useMinhasComunidades();
  const joinMutation = useJoinComunidade();
  const solicitarEntrada = useSolicitarEntrada();

  const comunidade = comunidadeQuery.data ?? {};
  const posts = useMemo(() => normalizeList(postsQuery.data), [postsQuery.data]);
  const minhasComunidades = useMemo(
    () => normalizeList(minhasQuery.data),
    [minhasQuery.data]
  );

  const minhasIds = useMemo(() => {
    return new Set(minhasComunidades.map((item) => getComunidadeId(item)));
  }, [minhasComunidades]);

  const comunidadeAtualId = String(comunidadeId ?? '');
  const participandoPorLista = minhasIds.has(comunidadeAtualId);

  const participandoPorBackend = Boolean(
    comunidade?.participando ??
      comunidade?.ehMembro ??
      comunidade?.isMember ??
      comunidade?.membro
  );

  const participando = participandoPorBackend || participandoPorLista;

  const membrosCountBruto =
    comunidade?.quantidadeMembros ??
    comunidade?.membrosCount ??
    comunidade?.totalMembros ??
    comunidade?.numeroMembros ??
    comunidade?.qtdMembros ??
    0;

  const membrosCount =
    participando && Number(membrosCountBruto) === 0
      ? 1
      : Number(membrosCountBruto) || 0;

  const postsCount =
    comunidade?.quantidadePosts ??
    comunidade?.postsCount ??
    comunidade?.totalPosts ??
    posts.length ??
    0;

  const handleEntrar = () => {
    const isPrivate = Boolean(comunidade?.privada ?? comunidade?.isPrivate ?? comunidade?.privada);
    if (isPrivate) {
      solicitarEntrada.mutate(comunidadeId);
    } else {
      joinMutation.mutate(comunidadeId);
    }
  };

  

  if (comunidadeQuery.isLoading || minhasQuery.isLoading) {
    return (
      <div className={styles.loadingBox}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/comunidades" className={styles.backLink}>
        <ArrowLeft size={16} />
        Voltar para comunidades
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Comunidade</span>

          <h1>{comunidade?.nome || 'Comunidade'}</h1>

          <p>
            {comunidade?.descricao ||
              'Um espaço para compartilhar experiências, cuidados e fotos sobre plantas.'}
          </p>

          <div className={styles.meta}>
            <span>
              <Users size={16} />
              {membrosCount} membro{membrosCount === 1 ? '' : 's'}
            </span>

            <span>
              <MessageSquare size={16} />
              {postsCount} post{postsCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {!participando && (
          <Button onClick={handleEntrar} loading={joinMutation.isPending}>
            Entrar na comunidade
          </Button>
        )}
      </section>
      {/* Admin panel: membros e solicitações */}
      {/** Show admin controls if current user is admin or the comunidade payload marks them as admin */}
      <AdminSection comunidadeId={comunidadeId} comunidade={comunidade} />

      <section className={styles.createPostCard}>
        <div className={styles.sectionHeader}>
          <h2>{participando ? 'Criar publicação' : 'Participe para publicar'}</h2>
          <p>
            {participando
              ? 'Compartilhe uma dica, foto, dúvida ou experiência com a comunidade.'
              : 'Entre na comunidade para compartilhar dicas, fotos e experiências.'}
          </p>

          {participando ? (
            <div style={{marginTop:12}}>
              <Button onClick={() => setShowCreate((s) => !s)}>
                {showCreate ? 'Cancelar' : 'Novo post'}
              </Button>
            </div>
          ) : null}
        </div>

        {participando && showCreate && (
          <div style={{marginTop:12}}>
            <CriarPostComunidade comunidadeId={comunidadeId} />
          </div>
        )}
      </section>

      <section className={styles.postsCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabButton} ${activeTab === 'posts' ? styles.active : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'members' ? styles.active : ''}`}
              onClick={() => setActiveTab('members')}
            >
              Membros
            </button>
          </div>
          <p>Veja o que a galera está compartilhando por aqui.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={styles.sortButtons} role="tablist" aria-label="Ordenar posts">
              <button type="button" className={`${styles.sortBtn} ${sortMode === 'recent' ? styles.active : ''}`} onClick={() => setSortMode('recent')}>Recentes</button>
              <button type="button" className={`${styles.sortBtn} ${sortMode === 'liked' ? styles.active : ''}`} onClick={() => setSortMode('liked')}>Curtidos</button>
              <button type="button" className={`${styles.sortBtn} ${sortMode === 'commented' ? styles.active : ''}`} onClick={() => setSortMode('commented')}>Comentados</button>
            </div>
          </div>
        </div>

        {activeTab === 'posts' && <FeedComunidade comunidadeId={comunidadeId} ordenarPor={backendOrdenarPor} />}
        {activeTab === 'members' && <ComunidadeMembros comunidadeId={comunidadeId} />}
      </section>
    </div>
  );
}