import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvento } from '../hooks/useEvento';
import EventoList from '../components/EventoList';
import Button from '../../../shared/components/ui/Button';

export default function EventosPage() {
  const { eventos, fetchAll, loading, error } = useEvento();

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Eventos</h2>
        <Link to="/eventos/criar">
          <Button>Criar Evento</Button>
        </Link>
      </div>

      {loading && <div>Carregando...</div>}
      {error && <div>Erro ao carregar eventos: {error.message}</div>}

      <EventoList eventos={eventos} />
    </div>
  );
}
 
