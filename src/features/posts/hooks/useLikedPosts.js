import { useState } from 'react';
import { postService } from '../services/postService';

export function useLikedPosts() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiked = async (usuarioCore) => {
    setLoading(true);
    try {
      const data = await postService.getLikedByUser(usuarioCore);
      setResults(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { fetchLiked, results, loading, error };
}
