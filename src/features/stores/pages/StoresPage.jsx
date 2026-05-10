import { Store, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import {
  useCreateStore,
  useDeleteStore,
  useMyStores,
  useStore,
  useStores,
  useUpdateStore,
} from '../hooks/useStores';
import styles from './StoresPage.module.css';

const EMPTY_FORM = {
  nome: '',
  descricao: '',
  email: '',
  telefone: '',
  imagemUrl: '',
  cidade: '',
  estado: '',
  endereco: '',
  somenteOnline: false,
};

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function StoreCard({
  store,
  expanded,
  onToggle,
  details,
  onDelete,
  onEdit,
  deleting,
}) {
  return (
    <article className={`${styles.storeCard} ${expanded ? styles.expanded : ''}`}>
      <button type="button" className={styles.storeContent} onClick={onToggle}>
        <strong>{store.nome || 'Loja'}</strong>
        <span>
          {store.somenteOnline
            ? 'Somente online'
            : [store.cidade, store.estado].filter(Boolean).join(' · ') ||
              'Local não informado'}
        </span>
      </button>

      <div className={styles.actions}>
        {onEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEdit(store.id)}
          >
            Editar
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(store.id)}
            disabled={deleting}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {expanded && details && (
        <div className={styles.expandedContent}>
          <p>{details.descricao || 'Sem descrição.'}</p>
          <small>{details.email}</small>
          <small>{details.telefone}</small>
          <small>{details.endereco}</small>

          {details.imagemUrl && (
            <img
              src={details.imagemUrl}
              alt={details.nome}
              className={styles.previewImage}
            />
          )}
        </div>
      )}
    </article>
  );
}

export default function StoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedStoreIdMy, setSelectedStoreIdMy] = useState(null);
  const [selectedStoreIdAll, setSelectedStoreIdAll] = useState(null);

  const [expandedStoreIdMy, setExpandedStoreIdMy] = useState(null);
  const [expandedStoreIdAll, setExpandedStoreIdAll] = useState(null);

  const stores = useStores();
  const myStores = useMyStores();
  const selectedStore = useStore(selectedStoreIdMy || selectedStoreIdAll);

  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  useEffect(() => {
    const store = myStores.data?.find((s) => s.id === editingStoreId);

    if (!store) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      nome: store.nome || '',
      descricao: store.descricao || '',
      email: store.email || '',
      telefone: store.telefone || '',
      imagemUrl: store.imagemUrl || '',
      cidade: store.cidade || '',
      estado: store.estado || '',
      endereco: store.endereco || '',
      somenteOnline: Boolean(store.somenteOnline),
    });

    setIsModalOpen(true);
  }, [editingStoreId, myStores.data]);

  const handleChange = (key, value) => {
    setForm((c) => ({ ...c, [key]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStoreId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finish = () => closeModal();

    if (editingStoreId) {
      updateStore.mutate(
        { id: editingStoreId, payload: form },
        { onSuccess: finish }
      );
      return;
    }

    createStore.mutate(form, { onSuccess: finish });
  };

  const toggleMy = (id) => {
    setExpandedStoreIdMy((p) => (p === id ? null : id));
    setSelectedStoreIdMy(id);
  };

  const toggleAll = (id) => {
    setExpandedStoreIdAll((p) => (p === id ? null : id));
    setSelectedStoreIdAll(id);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroHeader}>
          <div>
            <h1>Lojas</h1>
            <p>Gerencie suas lojas e explore o marketplace.</p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
          >
            Nova loja
          </Button>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.block}>
          <div className={styles.sectionHeader}>
            <h2>Minhas lojas</h2>
          </div>

          <div className={styles.storeList}>
            {(myStores.data || []).map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                expanded={expandedStoreIdMy === store.id}
                onToggle={() => toggleMy(store.id)}
                details={
                  selectedStoreIdMy === store.id ? selectedStore.data : null
                }
                onDelete={(id) => deleteStore.mutate(id)}
                onEdit={(id) => setEditingStoreId(id)}
                deleting={deleteStore.isPending}
              />
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.sectionHeader}>
            <h2>Todas as lojas</h2>
          </div>

          <div className={styles.storeList}>
            {(stores.data || []).map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                expanded={expandedStoreIdAll === store.id}
                onToggle={() => toggleAll(store.id)}
                details={
                  selectedStoreIdAll === store.id ? selectedStore.data : null
                }
              />
            ))}
          </div>
        </div>
      </section>

      <Modal open={isModalOpen} onClose={closeModal}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>{editingStoreId ? 'Editar loja' : 'Criar loja'}</h2>

          <Input label="Nome" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} />
          <Input label="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Telefone" value={form.telefone} onChange={(e) => handleChange('telefone', e.target.value)} />
          <Input label="Imagem URL" value={form.imagemUrl} onChange={(e) => handleChange('imagemUrl', e.target.value)} />
          <Input label="Cidade" value={form.cidade} onChange={(e) => handleChange('cidade', e.target.value)} />
          <Input label="Estado" value={form.estado} onChange={(e) => handleChange('estado', e.target.value)} />
          <Input label="Endereço" value={form.endereco} onChange={(e) => handleChange('endereco', e.target.value)} />

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.somenteOnline}
              onChange={(e) => handleChange('somenteOnline', e.target.checked)}
            />
            Somente online
          </label>

          <div className={styles.textareaLabel}>
            <textarea
              value={form.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={4}
              placeholder="Descrição"
            />
          </div>

          <div className={styles.formActions}>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}