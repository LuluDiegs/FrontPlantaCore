import React, { useEffect } from 'react';
import { useComunidade } from '../hooks/useComunidade';
import { ComunidadeList } from '../components/ComunidadeList';
import { useParams } from 'react-router-dom';

export function ComunidadeUserPage() {
  const { usuarioCore } = useParams();
  const { comunidades, getByUser, join, leave, loading, error } = useComunidade();

  useEffect(() => {
    if (usuarioCore) getByUser(usuarioCore);
  }, [usuarioCore]);

  return (
    <div>
      <h2>Comunidades do Usuário</h2>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}
      <ComunidadeList comunidades={comunidades} onJoin={join} onLeave={leave} />
    </div>
  );
}
