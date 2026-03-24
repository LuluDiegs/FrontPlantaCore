import React, { useEffect, useState } from 'react';
import { useComunidade } from '../hooks/useComunidade';
import { ComunidadeForm } from '../components/ComunidadeForm';
import { useParams } from 'react-router-dom';

export function ComunidadeEditPage() {
  const { comunidadeCore } = useParams();
  const { getById, update } = useComunidade();
  const [comunidade, setComunidade] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const com = await getById(comunidadeCore);
      setComunidade(com);
    }
    if (comunidadeCore) fetchData();
  }, [comunidadeCore]);

  const handleSubmit = async (data) => {
    await update(comunidadeCore, data);
    alert('Comunidade atualizada com sucesso!');
    // Redirecionar ou atualizar
  };

  if (!comunidade) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Editar Comunidade</h2>
      <ComunidadeForm onSubmit={handleSubmit} initialData={comunidade} />
    </div>
  );
}
