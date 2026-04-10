import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvento } from '../hooks/useEvento';
import Button from '../../../shared/components/ui/Button';
import toast from 'react-hot-toast';

export default function EventoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, remove, marcar, desmarcar } = useEvento();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getById(id);
        setEvento(data?.dados ?? data ?? null);
      } catch (e) {
        toast.error('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Deseja remover este evento?')) return;
    try {
      await remove(id);
      toast.success('Evento removido');
      navigate('/eventos');
    } catch (e) {
      toast.error('Erro ao remover evento');
    }
  };

  const handleParticipar = async () => {
    try {
      await marcar(id);
      toast.success('Participação marcada');
    } catch (e) {
      toast.error('Erro ao marcar participação');
    }
  };

  const handleDesmarcar = async () => {
    try {
      await desmarcar(id);
      toast.success('Participação removida');
    } catch (e) {
      toast.error('Erro ao desmarcar participação');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!evento) return <div>Evento não encontrado.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{evento.titulo}</h2>
        <div>
          <Link to={`/eventos/${id}/editar`}>
            <Button variant="ghost">Editar</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} style={{ marginLeft: 8 }}>
            Remover
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div><strong>Local:</strong> {evento.localizacao}</div>
        <div><strong>Data:</strong> {evento.dataInicio && new Date(evento.dataInicio).toLocaleString()}</div>
        <div style={{ marginTop: 12 }}>{evento.descricao}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button onClick={handleParticipar}>Participar</Button>
        <Button variant="ghost" onClick={handleDesmarcar} style={{ marginLeft: 8 }}>Desmarcar</Button>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventos } from '../hooks/useEventos';

export default function EventoDetailPage() {
  const { id } = useParams();
  const { getById, marcar, desmarcar } = useEventos();
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getById(id);
        setEvento(data?.dados ?? data ?? null);
      } catch (e) {
        console.error(e);
      }
    }
    if (id) load();
  }, [id]);

  if (!evento) return <div>Evento não encontrado ou carregando...</div>;

  return (
    <div>
      <h2>{evento.titulo}</h2>
      <p>{evento.descricao}</p>
      <p>Local: {evento.localizacao}</p>
      <p>Data início: {evento.dataInicio}</p>
      <div>
        <button onClick={() => marcar(id)}>Marcar participação</button>
        <button onClick={() => desmarcar(id)}>Desmarcar participação</button>
      </div>
      <Link to="/eventos">Voltar</Link>
    </div>
  );
}
