import React, { useEffect } from 'react';
import { useComunidade } from '../hooks/useComunidade';
import { ComunidadeList } from '../components/ComunidadeList';

export function ComunidadeMinePage() {
  const { comunidades, fetchMine, join, leave, loading, error } = useComunidade();

  useEffect(() => {
    fetchMine();
  }, []);

  return (
    <div>
      <h2>Minhas Comunidades</h2>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}
      <ComunidadeList comunidades={comunidades} onJoin={join} onLeave={leave} />
    </div>
  );
}
