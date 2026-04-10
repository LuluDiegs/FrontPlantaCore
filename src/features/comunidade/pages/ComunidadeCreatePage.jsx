import React from 'react';
import { ComunidadeForm } from '../components/ComunidadeForm';
import { useCreateComunidade } from '../hooks/useComunidade';
import { useNavigate } from 'react-router-dom';

export function ComunidadeCreatePage() {
  const createMutation = useCreateComunidade();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    navigate('/comunidades');
  };

  return (
    <div>
      <h2>Criar Comunidade</h2>
      <ComunidadeForm onSubmit={handleSubmit} />
    </div>
  );
}
