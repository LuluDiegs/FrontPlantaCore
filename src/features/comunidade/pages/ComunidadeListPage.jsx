import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useComunidade } from '../hooks/useComunidade';
import toast from 'react-hot-toast';
import { ComunidadeList } from '../components/ComunidadeList';
import { ComunidadeTabs } from '../components/ComunidadeTabs';
import { ComunidadeForm } from '../components/ComunidadeForm';
import { ComunidadeSearchPage } from './ComunidadeSearchPage';

export function ComunidadeListPage() {
  const [params, setParams] = useSearchParams();
  const initialTab = params.get('tab') || 'todas';

  const { comunidades, fetchAll, fetchMine, create, join, leave, loading, error } = useComunidade();
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setParams(tab === 'todas' ? {} : { tab });
    if (tab === 'todas') fetchAll();
    if (tab === 'minhas') fetchMine();
  }, [tab]);

  const handleCreate = async (data) => {
    try {
      await create(data);
      // after creating, show user's communities
      await fetchMine();
      setTab('minhas');
    } catch (e) {
      alert('Erro ao criar comunidade: ' + (e.message || e));
    }
  };

  const handleJoin = async (comunidadeId) => {
    try {
      await join(comunidadeId);
      toast.success('Entrou na comunidade');
      // refresh lists
      if (tab === 'minhas') await fetchMine();
      else await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.mensagem || err?.message || 'Erro ao entrar na comunidade';
      toast.error(msg);
    }
  };

  const handleLeave = async (comunidadeId) => {
    try {
      await leave(comunidadeId);
      toast.success('Saiu da comunidade');
      if (tab === 'minhas') await fetchMine();
      else await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.mensagem || err?.message || 'Erro ao sair da comunidade';
      toast.error(msg);
    }
  };

  return (
    <div>
      <h2>Comunidades</h2>
      <ComunidadeTabs onTabChange={setTab} />
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}

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
