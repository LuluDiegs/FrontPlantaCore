import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CreateUpdateEventForm from '../components/CreateUpdateEventForm';
import { useEvent } from '../hooks/useEvents';

export default function CreateUpdateEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const { data: event, isLoading } = useEvent(id, {
    enabled: isEdit,
  });

  if (isEdit && isLoading) return <p>Carregando...</p>;

  return (
    <div>
      <CreateUpdateEventForm
        event={event}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}