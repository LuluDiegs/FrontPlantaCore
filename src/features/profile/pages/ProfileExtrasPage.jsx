import React, { useState } from 'react';
import { useProfileExtras } from '../hooks/useProfileExtras';

export function ProfileExtrasPage() {
  const {
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
  } = useProfileExtras();

  // Exemplo de uso: cada ação pode ser chamada por um botão ou formulário
  // Aqui só um layout base para facilitar integração

  return (
    <div>
      <h2>Extras do Perfil</h2>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}
      <div>
        {/* Adicione formulários ou botões para cada ação conforme necessidade */}
        <p>Use os métodos do hook para integrar com UI conforme sua necessidade.</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
