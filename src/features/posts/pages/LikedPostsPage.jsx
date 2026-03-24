import React, { useState } from 'react';
import { useLikedPosts } from '../hooks/useLikedPosts';

export function LikedPostsPage() {
  const { fetchLiked, results, loading, error } = useLikedPosts();
  const [usuarioCore, setUsuarioCore] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    await fetchLiked(usuarioCore);
  };

  return (
    <div>
      <h2>Posts Curtidos</h2>
      <form onSubmit={handleFetch}>
        <input value={usuarioCore} onChange={e => setUsuarioCore(e.target.value)} placeholder="Usuário Core" />
        <button type="submit">Buscar</button>
      </form>
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
