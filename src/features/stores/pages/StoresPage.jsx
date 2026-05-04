import { Store, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Input from '../../../shared/components/ui/Input';
import Spinner from '../../../shared/components/ui/Spinner';
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

function StoreCard({ store, onSelect, onDelete, deleting }) {
  return (
    <article className={styles.storeCard}>
      <button type="button" className={styles.storeContent} onClick={() => onSelect(store.id)}>
        <strong>{store.nome || 'Loja'}</strong>
        <p>{store.descricao || 'Sem descrição cadastrada.'}</p>
        <span>{store.somenteOnline ? 'Somente online' : [store.cidade, store.estado].filter(Boolean).join(' · ') || 'Local não informado'}</span>
      </button>

      {onDelete && (
        <button type="button" className={styles.deleteBtn} onClick={() => onDelete(store.id)} disabled={deleting}>
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
}

export default function StoresPage() {
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const stores = useStores();
  const myStores = useMyStores();
  const selectedStore = useStore(selectedStoreId);
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  useEffect(() => {
    const store = myStores.data?.find((item) => item.id === editingStoreId);
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
  }, [editingStoreId, myStores.data]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingStoreId) {
      updateStore.mutate({ id: editingStoreId, payload: form }, {
        onSuccess: () => {
          setEditingStoreId(null);
          setForm(EMPTY_FORM);
        },
      });
      return;
    }

    createStore.mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
      },
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Marketplace</span>
          <h1>Lojas</h1>
          <p>Gerencie suas lojas e navegue pelas lojas já cadastradas no backend.</p>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.column}>
          <div className={styles.sectionHeader}>
            <h2>Minhas lojas</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
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
              <span>Somente online</span>
            </label>

            <label className={styles.textareaLabel}>
              <span>Descrição</span>
              <textarea value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} rows={4} />
            </label>

            <div className={styles.formActions}>
              <Button type="submit" loading={createStore.isPending || updateStore.isPending}>
                {editingStoreId ? 'Salvar alterações' : 'Criar loja'}
              </Button>
              {editingStoreId && (
                <Button type="button" variant="ghost" onClick={() => { setEditingStoreId(null); setForm(EMPTY_FORM); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          <div className={styles.storeList}>
            {(myStores.data || []).map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onSelect={setSelectedStoreId}
                onDelete={(id) => deleteStore.mutate(id)}
                deleting={deleteStore.isPending}
              />
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.sectionHeader}>
            <h2>Todas as lojas</h2>
          </div>

          {stores.isLoading ? (
            <div className={styles.loadingBox}>
              <Spinner />
            </div>
          ) : !(stores.data || []).length ? (
            <EmptyState
              icon={Store}
              title="Nenhuma loja cadastrada"
              description="Assim que alguém criar uma loja, ela aparece aqui."
            />
          ) : (
            <div className={styles.storeList}>
              {(stores.data || []).map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onSelect={setSelectedStoreId}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailPanel}>
        <div className={styles.sectionHeader}>
          <h2>Detalhes da loja</h2>
        </div>

        {!selectedStoreId ? (
          <p className={styles.placeholder}>Selecione uma loja para carregar o detalhe completo via endpoint dedicado.</p>
        ) : selectedStore.isLoading ? (
          <Spinner />
        ) : selectedStore.data ? (
          <div className={styles.detailCard}>
            <div>
              <h3>{selectedStore.data.nome}</h3>
              <p>{selectedStore.data.descricao}</p>
            </div>

            <div className={styles.detailGrid}>
              <span><strong>Email:</strong> {selectedStore.data.email || 'Não informado'}</span>
              <span><strong>Telefone:</strong> {selectedStore.data.telefone || 'Não informado'}</span>
              <span><strong>Cidade:</strong> {selectedStore.data.cidade || 'Não informada'}</span>
              <span><strong>Estado:</strong> {selectedStore.data.estado || 'Não informado'}</span>
              <span><strong>Endereço:</strong> {selectedStore.data.endereco || 'Não informado'}</span>
              <span><strong>Tipo:</strong> {selectedStore.data.somenteOnline ? 'Online' : 'Física / híbrida'}</span>
            </div>

            {selectedStore.data.imagemUrl && (
              <img src={selectedStore.data.imagemUrl} alt={selectedStore.data.nome} className={styles.previewImage} />
            )}

            {(myStores.data || []).some((store) => store.id === selectedStore.data.id) && (
              <Button type="button" variant="secondary" onClick={() => setEditingStoreId(selectedStore.data.id)}>
                Editar esta loja
              </Button>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
