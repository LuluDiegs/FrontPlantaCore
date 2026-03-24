import React from 'react';
import Button from '../../../shared/components/ui/Button';
import Avatar from '../../../shared/components/ui/Avatar';
import { useSolicitacoes, useAprovarSolicitacao } from '../hooks/useComunidade';
import styles from './ComunidadeSolicitacoes.module.css';

export default function ComunidadeSolicitacoes({ comunidadeId }) {
  const solicitacoesQuery = useSolicitacoes(comunidadeId);
  const aprovar = useAprovarSolicitacao();

  const solicitacoes = Array.isArray(solicitacoesQuery.data)
    ? solicitacoesQuery.data
    : solicitacoesQuery.data?.itens ?? [];

  if (solicitacoesQuery.isLoading) return <div>Carregando solicitações...</div>;
  if (!solicitacoes || solicitacoes.length === 0) return <div>Sem solicitações pendentes.</div>;

  return (
    <div className={styles.container}>
      <h3>Solicitações</h3>
      <ul className={styles.list}>
        {solicitacoes.map((s) => {
          const id = s.usuarioId || s.id || s.usuario?.id;
          const nome = s.usuarioNome || s.usuario?.nome || s.nome || 'Usuário';
          const foto = s.usuario?.fotoPerfil || s.fotoUsuario || s.foto || null;

          return (
            <li key={id} className={styles.item}>
              <div className={styles.left}>
                <Avatar src={foto} alt={nome} size="sm" />
                <div className={styles.info}>
                  <strong>{nome}</strong>
                  <div className={styles.meta}>{s?.mensagem || ''}</div>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  onClick={() => aprovar.mutate({ comunidadeId, usuarioId: id })}
                >
                  Aprovar
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
