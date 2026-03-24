import { useState } from 'react';
import { profileService } from '../services/profileService';

export function useProfileExtras() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updatePrivacy = async (privado) => {
    setLoading(true);
    try {
      const result = await profileService.updatePrivacy(privado);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const requestReactivation = async (email) => {
    setLoading(true);
    try {
      const result = await profileService.requestReactivation(email);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmReactivation = async (dataObj) => {
    setLoading(true);
    try {
      const result = await profileService.confirmReactivation(dataObj);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const verifyReactivationToken = async (dataObj) => {
    setLoading(true);
    try {
      const result = await profileService.verifyReactivationToken(dataObj);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const resetReactivationPassword = async (dataObj) => {
    setLoading(true);
    try {
      const result = await profileService.resetReactivationPassword(dataObj);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const requestFollow = async (alvoCore) => {
    setLoading(true);
    try {
      const result = await profileService.requestFollow(alvoCore);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const getFollowRequests = async () => {
    setLoading(true);
    try {
      const result = await profileService.getFollowRequests();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const acceptFollowRequest = async (solicitacaoCore) => {
    setLoading(true);
    try {
      const result = await profileService.acceptFollowRequest(solicitacaoCore);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const rejectFollowRequest = async (solicitacaoCore) => {
    setLoading(true);
    try {
      const result = await profileService.rejectFollowRequest(solicitacaoCore);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const getUserPlants = async (usuarioCore, pagina = 1, tamanho = 12) => {
    setLoading(true);
    try {
      const result = await profileService.getUserPlants(usuarioCore, pagina, tamanho);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const getUserPosts = async (usuarioCore, pagina = 1, tamanho = 10) => {
    setLoading(true);
    try {
      const result = await profileService.getUserPosts(usuarioCore, pagina, tamanho);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePrivacy,
    requestReactivation,
    confirmReactivation,
    verifyReactivationToken,
    resetReactivationPassword,
    requestFollow,
    getFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
    getUserPlants,
    getUserPosts,
    loading,
    error,
    data,
  };
}
