import React from 'react';
import { useComunidade } from '../hooks/useComunidade';
import { ComunidadeForm } from '../components/ComunidadeForm';

export function ComunidadeCreatePage() {
  const { create } = useComunidade();

  const handleSubmit = async (data) => {
    await create(data);
    alert('Comunidade criada com sucesso!');
    // Redirecionar ou atualizar lista
  };

  return (
    <div>
      <h2>Criar Comunidade</h2>
      <ComunidadeForm onSubmit={handleSubmit} />
    </div>
  );
}
