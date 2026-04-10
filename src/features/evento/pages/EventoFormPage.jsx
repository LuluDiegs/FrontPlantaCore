import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvento } from '../hooks/useEvento';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import toast from 'react-hot-toast';

export default function EventoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { create, getById, update } = useEvento();
  const [values, setValues] = useState({ titulo: '', descricao: '', localizacao: '', dataInicio: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getById(id);
        const e = data?.dados ?? data ?? {};
        const toLocalInput = (iso) => {
          if (!iso) return '';
          try {
            const d = new Date(iso);
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          } catch {
            return iso;
          }
        };

        setValues({
          titulo: e.titulo || '',
          descricao: e.descricao || '',
          localizacao: e.localizacao || '',
          dataInicio: toLocalInput(e.dataInicio) || '',
        });
      } catch (e) {
        toast.error('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (field) => (ev) => setValues((s) => ({ ...s, [field]: ev.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const payload = { ...values };
      if (payload.dataInicio) {
        try {
          payload.dataInicio = new Date(payload.dataInicio).toISOString();
        } catch {}
      }

      if (id) {
        await update(id, payload);
        toast.success('Evento atualizado');
      } else {
        await create(payload);
        toast.success('Evento criado');
      }
      navigate('/eventos');
    } catch (e) {
      console.error(e);
      const resp = e?.response?.data;
      const message = resp?.mensagem || resp?.message || (typeof resp === 'string' ? resp : null) || e.message || 'Erro ao salvar evento';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Evento' : 'Criar Evento'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 600 }}>
        <Input label="Título" value={values.titulo} onChange={handleChange('titulo')} required />
        <Input label="Localização" value={values.localizacao} onChange={handleChange('localizacao')} required />
        <label>Data Início</label>
        <input
          type="datetime-local"
          value={values.dataInicio}
          onChange={(e) => setValues((s) => ({ ...s, dataInicio: e.target.value }))}
          required
        />
        <small style={{ color: '#666', marginTop: 4 }}>Escolha data e hora de início</small>
        <label>Descrição</label>
        <textarea value={values.descricao} onChange={handleChange('descricao')} rows={6} />

        <div style={{ marginTop: 12 }}>
          <Button type="submit">Salvar</Button>
          <Button variant="ghost" onClick={() => navigate('/eventos')} style={{ marginLeft: 8 }}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
