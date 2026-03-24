import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, Send } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/ui/Spinner';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { useCreatePost } from '../../posts/hooks/usePost';
import {
  useComunidadeById,
  useComunidadePosts,
  useJoinComunidade,
  useMinhasComunidades,
} from '../hooks/useComunidade';
import styles from './ComunidadeDetailPage.module.css';

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
  const [conteudo, setConteudo] = useState('');

  const comunidadeQuery = useComunidadeById(comunidadeId);
  const postsQuery = useComunidadePosts(comunidadeId);
  const minhasQuery = useMinhasComunidades();
  const joinMutation = useJoinComunidade();
  const createPostMutation = useCreatePost(comunidadeId);

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
    joinMutation.mutate(comunidadeId);
  };

  const handleCriarPost = async (e) => {
    e.preventDefault();

    if (!conteudo.trim()) return;

    await createPostMutation.mutateAsync({
      conteudo: conteudo.trim(),
      comunidadeId,
    });

    setConteudo('');
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

      {participando && (
        <section className={styles.createPostCard}>
          <div className={styles.sectionHeader}>
            <h2>Criar publicação</h2>
            <p>
              Compartilhe uma dica, foto, dúvida ou experiência com a comunidade.
            </p>
          </div>

          <form onSubmit={handleCriarPost} className={styles.postForm}>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Escreva algo para a comunidade..."
              rows={5}
            />

            <div className={styles.postFormActions}>
              <Button
                type="submit"
                loading={createPostMutation.isPending}
                disabled={!conteudo.trim()}
              >
                <Send size={16} />
                Publicar
              </Button>
            </div>
          </form>
        </section>
      )}

      {!participando && (
        <section className={styles.createPostCard}>
          <div className={styles.sectionHeader}>
            <h2>Participe para publicar</h2>
            <p>
              Entre na comunidade para compartilhar dicas, fotos e experiências.
            </p>
          </div>
        </section>
      )}

      <section className={styles.postsCard}>
        <div className={styles.sectionHeader}>
          <h2>Posts da comunidade</h2>
          <p>Veja o que a galera está compartilhando por aqui.</p>
        </div>

        {postsQuery.isLoading && (
          <div className={styles.loadingBox}>
            <Spinner />
          </div>
        )}

        {!postsQuery.isLoading && posts.length === 0 && (
          <EmptyState
            title="Ainda não há posts"
            description="Essa comunidade ainda não tem publicações. Seja a primeira pessoa a movimentar esse espaço."
          />
        )}

        {!postsQuery.isLoading && posts.length > 0 && (
          <div className={styles.postsList}>
            {posts.map((post) => (
              <article key={post.id} className={styles.postItem}>
                <div className={styles.postHeader}>
                  <div className={styles.avatar}>
                    {(post?.autor?.nome || post?.usuarioNome || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {post?.autor?.nome || post?.usuarioNome || 'Usuário'}
                    </strong>
                    <span>
                      {post?.dataCriacao
                        ? new Date(post.dataCriacao).toLocaleString('pt-BR')
                        : 'Agora'}
                    </span>
                  </div>
                </div>

                <p className={styles.postContent}>
                  {post?.conteudo || 'Sem conteúdo.'}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}