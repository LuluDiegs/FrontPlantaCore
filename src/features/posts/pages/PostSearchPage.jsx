import React, { useState } from 'react';
import { usePostSearch } from '../hooks/usePostSearch';

export function PostSearchPage() {
  const { searchHashtag, searchCategoria, searchPalavraChave, results, loading, error } = usePostSearch();
  const [hashtag, setHashtag] = useState('');
  const [categoria, setCategoria] = useState('');
  const [palavraChave, setPalavraChave] = useState('');
  const [sortMode, setSortMode] = useState('recent');

  const sortMap = {
    recent: 'mais_recente',
    liked: 'mais_curtido',
    commented: 'mais_comentado',
    oldest: 'mais_antigo',
  };

  const backendOrdenarPor = sortMap[sortMode] || 'mais_recente';

  return (
    <div>
      <h2>Buscar Posts</h2>
      <form onSubmit={e => { e.preventDefault(); searchHashtag(hashtag, backendOrdenarPor); }}>
        <input value={hashtag} onChange={e => setHashtag(e.target.value)} placeholder="Hashtag" />
        <button type="submit">Buscar por Hashtag</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); searchCategoria(categoria); }}>
        <input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Categoria" />
        <button type="submit">Buscar por Categoria</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); searchPalavraChave(palavraChave); }}>
        <input value={palavraChave} onChange={e => setPalavraChave(e.target.value)} placeholder="Palavra-chave" />
        <button type="submit">Buscar por Palavra-chave</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <label style={{ marginRight: 8 }}>Ordenar por:</label>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
          <option value="recent">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="liked">Mais curtidos</option>
          <option value="commented">Mais comentados</option>
        </select>
      </div>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error.message}</div>}
      <ul>
        {results.map((post) => (
          <li key={post.id}>{post.conteudo}</li>
        ))}
      </ul>
    </div>
  );
}
