import React, { useState } from 'react';
import { useComunidade } from '../hooks/useComunidade';
import { ComunidadeList } from '../components/ComunidadeList';
import Button from '../../../shared/components/ui/Button';
import styles from '../components/ComunidadeForm.module.css';

export function ComunidadeSearchPage() {
  const { search, join, leave } = useComunidade();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      const data = await search(termo);
      setResultados(data?.itens ?? data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Comunidade</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input className={styles.input || ''} value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Termo de busca" />
        <Button type="submit" variant="primary" loading={loading}>Buscar</Button>
      </form>

      {error && <div>Erro: {error.message}</div>}
      <ComunidadeList comunidades={resultados} onJoin={join} onLeave={leave} />
    </div>
  );
}
