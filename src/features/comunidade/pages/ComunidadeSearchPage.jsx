import React, { useEffect, useState } from 'react';
import { useBuscarComunidades, useJoinComunidade, useLeaveComunidade } from '../hooks/useComunidade';
import ComunidadeList from '../components/ComunidadeList';
import Button from '../../../shared/components/ui/Button';
import styles from '../components/ComunidadeForm.module.css';

export function ComunidadeSearchPage() {
  const [termo, setTermo] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(termo.trim()), 350);
    return () => clearTimeout(t);
  }, [termo]);

  const buscarQuery = useBuscarComunidades(debouncedTerm);
  const joinMutation = useJoinComunidade();
  const leaveMutation = useLeaveComunidade();

  const resultados = buscarQuery.data?.itens ?? buscarQuery.data ?? [];

  return (
    <div>
      <h2>Buscar Comunidade</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input className={styles.input || ''} value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Termo de busca" />
        <Button variant="primary" onClick={() => setDebouncedTerm(termo)} loading={buscarQuery.isFetching}>Buscar</Button>
      </div>

      {buscarQuery.isError && <div>Erro ao buscar comunidades</div>}
      <ComunidadeList comunidades={resultados} onJoin={(id) => joinMutation.mutate(id)} onLeave={(id) => leaveMutation.mutate(id)} />
    </div>
  );
}
