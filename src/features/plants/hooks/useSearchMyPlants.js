import { useState } from 'react';
import { plantService } from '../services/plantService';

export function useSearchMyPlants() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (termo, pagina = 1, tamanho = 10) => {
    setLoading(true);
    try {
      const data = await plantService.searchMyPlants(termo, pagina, tamanho);
      setResults(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { search, results, loading, error };
}
