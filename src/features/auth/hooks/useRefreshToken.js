import { useState } from 'react';
import { authService } from '../services/authService';

export function useRefreshToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const refresh = async (tokenRefresh) => {
    setLoading(true);
    try {
      const result = await authService.refreshToken(tokenRefresh);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { refresh, loading, error, data };
}
