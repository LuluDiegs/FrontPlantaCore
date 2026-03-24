import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../../shared/components/ui/Avatar';
import Button from '../../../shared/components/ui/Button';
import ConfirmModal from '../../../shared/components/ui/ConfirmModal';
import { useAuthStore } from '../../auth/stores/authStore';
import { useMembros, useExpulsar, useTransferirAdmin, useAdmins } from '../hooks/useComunidade';
import styles from './ComunidadeMembros.module.css';

export default function ComunidadeMembros({ comunidadeId }) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const membrosQuery = useMembros(comunidadeId);
  const adminsQuery = useAdmins(comunidadeId);
  const expulsar = useExpulsar();
  const transferir = useTransferirAdmin();

  const admins = adminsQuery.data || [];
  const isAdmin = admins.some((a) => String(a?.id || a?.usuarioId) === String(currentUserId));

  const membros = Array.isArray(membrosQuery.data)
    ? membrosQuery.data
    : (membrosQuery.data?.itens ?? membrosQuery.data?.dados ?? []);

  const [confirm, setConfirm] = React.useState({ open: false, type: null, targetId: null, targetName: null });

  if (membrosQuery.isLoading) return <div>Carregando membros...</div>;
  if (membros.length === 0) return <div>Nenhum membro encontrado.</div>;

  return (
    <div className={styles.container}>
      <h3>Membros</h3>
      <ul className={styles.list}>
        {membros.map((m) => {
          const id = m.id || m.usuarioId || m.usuario?.id;
          const nome = m.nome || m.usuario?.nome || m.usuarioNome || m.usuario?.nomeCompleto || 'Usuário';
          const username = m.usuario?.username || m.usuario?.login || m.usuario?.email?.split('@')?.[0];
          const foto = m.fotoUsuario || m.usuario?.fotoPerfil || m.usuario?.fotoPerfilUrl || m.foto || null;
          const isThisAdmin = admins.some((a) => String(a?.id || a?.usuarioId) === String(id));

          const handleExpulsar = () => {
            setConfirm({ open: true, type: 'expulsar', targetId: id, targetName: nome });
          };

          const handleTransferir = () => {
            setConfirm({ open: true, type: 'transferir', targetId: id, targetName: nome });
          };

          return (
            <li key={id ?? `m-${nome}`} className={styles.item}>
              <Link to={`/usuario/${id}`} className={styles.userLink}>
                <Avatar src={foto} alt={nome} size="md" />
                <div className={styles.userInfo}>
                  <strong className={styles.userName}>{nome}</strong>
                  {username && <span className={styles.userHandle}>@{username}</span>}
                </div>
              </Link>

              <div className={styles.actions}>
                {isThisAdmin && <span className={styles.adminBadge}>Admin</span>}

                {isAdmin && String(currentUserId) !== String(id) && (
                  <>
                    <Button
                      variant="danger"
                      onClick={handleExpulsar}
                      loading={expulsar.isLoading}
                    >
                      Expulsar
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleTransferir}
                      loading={transferir.isLoading}
                    >
                      Transferir admin
                    </Button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        open={confirm.open}
        title={confirm.type === 'transferir' ? 'Transferir administração' : 'Remover membro'}
        description={
          confirm.type === 'transferir'
            ? `Transferir administração para ${confirm.targetName}? Você perderá privilégios de admin.`
            : `Remover ${confirm.targetName} da comunidade? Esta ação pode ser revertida apenas pelo admin.`
        }
        confirmLabel={confirm.type === 'transferir' ? 'Transferir' : 'Remover'}
        onClose={() => setConfirm({ open: false, type: null })}
        onConfirm={() => {
          if (confirm.type === 'transferir') {
            transferir.mutate({ comunidadeId, novoAdminId: confirm.targetId });
          } else if (confirm.type === 'expulsar') {
            expulsar.mutate({ comunidadeId, usuarioId: confirm.targetId });
          }
          setConfirm({ open: false, type: null });
        }}
        loading={expulsar.isLoading || transferir.isLoading}
      />
    </div>
  );
}
