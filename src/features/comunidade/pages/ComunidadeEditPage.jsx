import React, { useEffect, useState } from 'react';
import { ComunidadeForm } from '../components/ComunidadeForm';
import { useParams, useNavigate } from 'react-router-dom';
import { useComunidadeById, useUpdateComunidade } from '../hooks/useComunidade';

export function ComunidadeEditPage() {
  const { comunidadeCore } = useParams();
  const navigate = useNavigate();
  const { data: comunidadeData, isLoading } = useComunidadeById(comunidadeCore);
  const updateMutation = useUpdateComunidade();

  const handleSubmit = async (data) => {
    await updateMutation.mutateAsync({ comunidadeId: comunidadeCore, payload: data });
    navigate(`/comunidade/${comunidadeCore}`);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Editar Comunidade</h2>
      <ComunidadeForm onSubmit={handleSubmit} initialData={comunidadeData} />
    </div>
  );
}
