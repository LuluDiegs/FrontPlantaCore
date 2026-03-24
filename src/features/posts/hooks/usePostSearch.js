import { useState } from 'react';
import { postService } from '../services/postService';

export function usePostSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHashtag = async (hashtag) => {
    setLoading(true);
    try {
      const data = await postService.searchByHashtag(hashtag);
      setResults(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const searchCategoria = async (categoria) => {
    setLoading(true);
    try {
      const data = await postService.searchByCategoria(categoria);
      setResults(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const searchPalavraChave = async (palavraChave) => {
    setLoading(true);
    try {
      const data = await postService.searchByPalavraChave(palavraChave);
      setResults(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { searchHashtag, searchCategoria, searchPalavraChave, results, loading, error };
}
