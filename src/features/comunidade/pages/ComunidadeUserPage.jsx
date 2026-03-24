import React from 'react';
import { useParams } from 'react-router-dom';
import ComunidadeList from '../components/ComunidadeList';
import { useComunidadesByUsuario, useJoinComunidade, useLeaveComunidade } from '../hooks/useComunidade';

export function ComunidadeUserPage() {
  const { usuarioCore } = useParams();
  const comunidadesQuery = useComunidadesByUsuario(usuarioCore);
  const joinMutation = useJoinComunidade();
  const leaveMutation = useLeaveComunidade();

  const comunidades = comunidadesQuery.data?.itens ?? comunidadesQuery.data ?? [];

  return (
    <div>
      <h2>Comunidades do Usuário</h2>
      {comunidadesQuery.isLoading && <div>Carregando...</div>}
      {comunidadesQuery.isError && <div>Erro ao carregar comunidades</div>}
      <ComunidadeList comunidades={comunidades} onJoin={(id) => joinMutation.mutate(id)} onLeave={(id) => leaveMutation.mutate(id)} />
    </div>
  );
}
