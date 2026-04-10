import React from 'react';
import ComunidadeList from '../components/ComunidadeList';
import { useMinhasComunidades, useJoinComunidade, useLeaveComunidade } from '../hooks/useComunidade';

export function ComunidadeMinePage() {
  const minhasQuery = useMinhasComunidades();
  const joinMutation = useJoinComunidade();
  const leaveMutation = useLeaveComunidade();

  const comunidades = minhasQuery.data?.itens ?? minhasQuery.data ?? [];

  return (
    <div>
      <h2>Minhas Comunidades</h2>
      {minhasQuery.isLoading && <div>Carregando...</div>}
      {minhasQuery.isError && <div>Erro ao carregar suas comunidades</div>}
      <ComunidadeList comunidades={comunidades} onJoin={(id) => joinMutation.mutate(id)} onLeave={(id) => leaveMutation.mutate(id)} />
    </div>
  );
}
