import React, { useState } from 'react';
import { useSearchMyPlants } from '../hooks/useSearchMyPlants';

export function SearchMyPlantsPage() {
  const { search, results, loading, error } = useSearchMyPlants();
  const [termo, setTermo] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    await search(termo);
  };

  return (
    <div>
      <h2>Buscar Minhas Plantas</h2>
      <form onSubmit={handleSearch}>
        <input value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Termo de busca" />
        <button type="submit">Buscar</button>
      </form>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}
      <ul>
        {results.map((planta) => (
          <li key={planta.id}>{planta.nome}</li>
        ))}
      </ul>
    </div>
  );
}
