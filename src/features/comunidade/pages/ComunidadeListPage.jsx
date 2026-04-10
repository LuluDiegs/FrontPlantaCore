import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComunidadeList from '../components/ComunidadeList';
import ComunidadeTabs from '../components/ComunidadeTabs';
import { ComunidadeForm } from '../components/ComunidadeForm';
import ComunidadeSearchPage from './ComunidadeSearchPage';
import { useComunidades, useMinhasComunidades, useCreateComunidade, useJoinComunidade, useLeaveComunidade } from '../hooks/useComunidade';

export function ComunidadeListPage() {
  const [params, setParams] = useSearchParams();
  const initialTab = params.get('tab') || 'todas';

  const [tab, setTab] = useState(initialTab);

  const comunidadesQuery = useComunidades();
  const minhasQuery = useMinhasComunidades();
  const createMutation = useCreateComunidade();
  const joinMutation = useJoinComunidade();
  const leaveMutation = useLeaveComunidade();

  useEffect(() => {
    setParams(tab === 'todas' ? {} : { tab });
  }, [tab]);

  const comunidades = tab === 'minhas' ? (minhasQuery.data?.itens ?? minhasQuery.data ?? []) : (comunidadesQuery.data?.itens ?? comunidadesQuery.data ?? []);

  const handleCreate = async (data) => {
    await createMutation.mutateAsync(data);
    setTab('minhas');
  };

  const handleJoin = (comunidadeId) => joinMutation.mutate(comunidadeId);
  const handleLeave = (comunidadeId) => leaveMutation.mutate(comunidadeId);

  return (
    <div>
      <h2>Comunidades</h2>
      <ComunidadeTabs active={tab} onTabChange={setTab} />
      {(comunidadesQuery.isLoading || minhasQuery.isLoading) && <div>Carregando...</div>}

      {tab === 'todas' && <ComunidadeList comunidades={comunidades} onJoin={handleJoin} onLeave={handleLeave} />}
      {tab === 'minhas' && <ComunidadeList comunidades={comunidades} onJoin={handleJoin} onLeave={handleLeave} />}

      {tab === 'criar' && (
        <div style={{ marginTop: 12 }}>
          <ComunidadeForm onSubmit={handleCreate} />
        </div>
      )}

      {tab === 'buscar' && (
        <div style={{ marginTop: 12 }}>
          <ComunidadeSearchPage />
        </div>
      )}
    </div>
  );
}
