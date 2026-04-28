import { useState } from 'react';
import { postService } from '../services/postService';

function normalizePosts(payload) {
  return payload?.posts || payload?.dados?.posts || payload?.dados?.itens || payload?.dados || [];
}

export function usePostSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHashtag = async (hashtag, ordenarPor) => {
    setLoading(true);
    try {
      const data = await postService.searchByHashtag(hashtag, 1, 50, ordenarPor);
      setResults(normalizePosts(data));
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const searchCategoria = async (categoria, ordenarPor) => {
    setLoading(true);
    try {
      const data = await postService.searchByCategoria(categoria, 1, 50, ordenarPor);
      setResults(normalizePosts(data));
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const searchPalavraChave = async (palavraChave, ordenarPor) => {
    setLoading(true);
    try {
      const data = await postService.searchByPalavraChave(palavraChave, 1, 50, ordenarPor);
      setResults(normalizePosts(data));
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { searchHashtag, searchCategoria, searchPalavraChave, results, loading, error };
}
