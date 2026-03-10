import {
  currentUser,
  otherUsers,
  plants,
  posts,
  comments,
  notifications,
  searchResults,
} from './data';

// ─── Estado mutável em memória ──────────────────────────────
let mockPosts = [...posts];
let mockComments = JSON.parse(JSON.stringify(comments));
let mockNotifications = [...notifications];
let mockPlants = [...plants];
let mockFollowing = ['u3-mock-id'];

let commentCounter = 100;
let postCounter = 100;

// ─── Helpers ────────────────────────────────────────────────
function uuid() {
  return 'mock-' + Math.random().toString(36).slice(2, 11);
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 200));
}

function ok(dados, mensagem = '') {
  return { sucesso: true, dados, mensagem, erros: [] };
}

function paginate(items, pagina = 1, tamanho = 10) {
  const start = (pagina - 1) * tamanho;
  const itens = items.slice(start, start + tamanho);
  const total = items.length;
  const totalPaginas = Math.ceil(total / tamanho);
  return {
    itens,
    pagina,
    tamanho,
    total,
    totalPaginas,
    temProxima: pagina < totalPaginas,
    temAnterior: pagina > 1,
  };
}

function mockResponse(data, status = 200) {
  return { data, status, statusText: 'OK', headers: {} };
}

function getParams(config) {
  return config.params || {};
}

function getBody(config) {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try { return JSON.parse(config.data); } catch { return {}; }
  }
  return config.data;
}

// ─── Route matching ─────────────────────────────────────────
function match(url, pattern) {
  const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
  const m = url.match(regex);
  return m ? m.slice(1) : null;
}

// ─── Handlers ───────────────────────────────────────────────
const handlers = {
  // ── Auth ──────────────────────────────────────────────────
  'POST /Autenticacao/login': (config) => {
    const body = getBody(config);
    return mockResponse(ok({
      usuarioId: currentUser.id,
      nome: currentUser.nome,
      email: body.email || currentUser.email,
      tokenAcesso: 'mock-access-token-' + Date.now(),
      tokenRefresh: 'mock-refresh-token-' + Date.now(),
    }));
  },

  'POST /Autenticacao/registrar': () => {
    return mockResponse(ok(null, 'Conta criada com sucesso! Verifique seu email.'));
  },

  'POST /Autenticacao/confirmar-email': () => {
    return mockResponse(ok(null, 'Email confirmado com sucesso!'));
  },

  'POST /Autenticacao/resetar-senha': () => {
    return mockResponse(ok(null, 'Email de recuperação enviado.'));
  },

  'POST /Autenticacao/nova-senha': () => {
    return mockResponse(ok(null, 'Senha redefinida com sucesso!'));
  },

  'POST /Autenticacao/reenviar-confirmacao': () => {
    return mockResponse(ok(null, 'Email reenviado.'));
  },

  'POST /Autenticacao/logout': () => {
    return mockResponse(ok(null));
  },

  'POST /Autenticacao/refresh-token': () => {
    return mockResponse(ok({
      tokenAcesso: 'mock-access-refreshed-' + Date.now(),
      tokenRefresh: 'mock-refresh-refreshed-' + Date.now(),
    }));
  },

  // ── Perfil ────────────────────────────────────────────────
  'GET /Usuario/perfil': () => {
    return mockResponse(ok(currentUser));
  },

  'GET /Usuario/perfil-publico/:id': (config, [userId]) => {
    const user = otherUsers.find((u) => u.id === userId);
    if (!user) return mockResponse({ sucesso: false, dados: null, mensagem: 'Usuário não encontrado', erros: [] }, 404);
    return mockResponse(ok({
      ...user,
      userSegueEste: mockFollowing.includes(userId),
    }));
  },

  'PUT /Usuario/nome': () => {
    return mockResponse(ok(null, 'Nome atualizado.'));
  },

  'PUT /Usuario/biografia': () => {
    return mockResponse(ok(null, 'Biografia atualizada.'));
  },

  'POST /Usuario/foto-perfil': () => {
    return mockResponse(ok({ url: currentUser.fotoPerfil }, 'Foto atualizada.'));
  },

  'POST /Usuario/seguir/:id': (config, [userId]) => {
    if (!mockFollowing.includes(userId)) mockFollowing.push(userId);
    return mockResponse(ok(null, 'Seguindo.'));
  },

  'DELETE /Usuario/seguir/:id': (config, [userId]) => {
    mockFollowing = mockFollowing.filter((id) => id !== userId);
    return mockResponse(ok(null, 'Deixou de seguir.'));
  },

  'GET /Usuario/:id/seguidores': (config) => {
    const users = otherUsers.slice(0, 2).map((u) => ({
      id: u.id,
      nome: u.nome,
      fotoPerfil: u.fotoPerfil,
      biografia: u.biografia,
    }));
    return mockResponse(ok(users));
  },

  'GET /Usuario/:id/seguindo': (config) => {
    const users = otherUsers.slice(1, 3).map((u) => ({
      id: u.id,
      nome: u.nome,
      fotoPerfil: u.fotoPerfil,
      biografia: u.biografia,
    }));
    return mockResponse(ok(users));
  },

  // ── Plantas ───────────────────────────────────────────────
  'POST /Planta/identificar': () => {
    const plant = {
      ...mockPlants[0],
      id: uuid(),
    };
    mockPlants.unshift(plant);
    return mockResponse(ok(plant));
  },

  'POST /Planta/buscar': (config) => {
    const { pagina = 0 } = getBody(config);
    return mockResponse(ok({
      itens: searchResults,
      pagina,
      totalPaginas: 1,
      temProxima: false,
    }));
  },

  'POST /Planta/buscar/adicionar': (config) => {
    const body = getBody(config);
    const newPlant = {
      id: uuid(),
      nome: body.nomeComum || 'Planta adicionada',
      nomePopular: body.nomeComum || '',
      nomeCientifico: body.nomeCientifico || '',
      descricao: 'Planta adicionada da busca.',
      foto: body.foto || '',
      toxica: false,
      cuidados: { luz: '-', agua: '-', temperatura: '-', cuidadosEspeciais: '-' },
      usuarioId: currentUser.id,
      dataCriacao: new Date().toISOString(),
    };
    mockPlants.unshift(newPlant);
    return mockResponse(ok(newPlant));
  },

  'GET /Planta/minhas-plantas': (config) => {
    const { pagina = 1, tamanho = 12 } = getParams(config);
    return mockResponse(ok(paginate(mockPlants, Number(pagina), Number(tamanho))));
  },

  'GET /Planta/:id': (config, [plantaId]) => {
    const plant = mockPlants.find((p) => p.id === plantaId);
    if (!plant) return mockResponse({ sucesso: false, dados: null, mensagem: 'Planta não encontrada', erros: [] }, 404);
    return mockResponse(ok(plant));
  },

  'DELETE /Planta/:id': (config, [plantaId]) => {
    mockPlants = mockPlants.filter((p) => p.id !== plantaId);
    return mockResponse(ok(null, 'Planta removida.'));
  },

  'POST /Planta/:id/gerar-lembrete-cuidado': (config, [plantaId]) => {
    const plant = mockPlants.find((p) => p.id === plantaId);
    return mockResponse(ok({
      lembrete: `Lembrete: Regue sua ${plant?.nome || 'planta'} amanhã cedo. Verifique se o solo está seco antes de regar. Mantenha em local com ${plant?.cuidados?.luz || 'luz adequada'}.`,
    }));
  },

  // ── Posts ──────────────────────────────────────────────────
  'POST /Post': (config) => {
    const body = getBody(config);
    const plant = body.plantaId ? mockPlants.find((p) => p.id === body.plantaId) : null;
    const newPost = {
      id: 'post-' + (++postCounter),
      conteudo: body.conteudo,
      usuarioId: currentUser.id,
      usuarioNome: currentUser.nome,
      fotoUsuario: currentUser.fotoPerfil,
      plantaId: body.plantaId || null,
      plantaNome: plant?.nome || null,
      totalCurtidas: 0,
      totalComentarios: 0,
      curtiuUsuario: false,
      dataCriacao: new Date().toISOString(),
    };
    mockPosts.unshift(newPost);
    return mockResponse(ok(newPost));
  },

  'DELETE /Post/:id': (config, [postId]) => {
    mockPosts = mockPosts.filter((p) => p.id !== postId);
    return mockResponse(ok(null, 'Post removido.'));
  },

  'GET /Post/:id': (config, [postId]) => {
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) return mockResponse({ sucesso: false, dados: null, mensagem: 'Post não encontrado', erros: [] }, 404);
    return mockResponse(ok(post));
  },

  'GET /Post/feed': (config) => {
    const { pagina = 1, tamanho = 10 } = getParams(config);
    const start = (Number(pagina) - 1) * Number(tamanho);
    const slice = mockPosts.slice(start, start + Number(tamanho));
    return mockResponse(ok(slice));
  },

  'GET /Post/explorar': (config) => {
    const { pagina = 1, tamanho = 10 } = getParams(config);
    return mockResponse(ok(paginate(mockPosts, Number(pagina), Number(tamanho))));
  },

  'GET /Post/usuario/:id': (config, [userId]) => {
    const { pagina = 1, tamanho = 10 } = getParams(config);
    const userPosts = mockPosts.filter((p) => p.usuarioId === userId);
    return mockResponse(ok(paginate(userPosts, Number(pagina), Number(tamanho))));
  },

  'POST /Post/:id/curtir': (config, [postId]) => {
    const post = mockPosts.find((p) => p.id === postId);
    if (post) { post.curtiuUsuario = true; post.totalCurtidas++; }
    return mockResponse(ok(null));
  },

  'DELETE /Post/:id/curtida': (config, [postId]) => {
    const post = mockPosts.find((p) => p.id === postId);
    if (post) { post.curtiuUsuario = false; post.totalCurtidas = Math.max(0, post.totalCurtidas - 1); }
    return mockResponse(ok(null));
  },

  'GET /Post/:id/comentarios': (config, [postId]) => {
    return mockResponse(ok(mockComments[postId] || []));
  },

  'PUT /Post/:id': (config, [postId]) => {
    const body = getBody(config);
    const post = mockPosts.find((p) => p.id === postId);
    if (post && body.conteudo) {
      post.conteudo = body.conteudo;
      post.editado = true;
    }
    return mockResponse(ok(post));
  },

  'POST /Post/comentario/:id/curtir': (config, [comentarioId]) => {
    for (const postId of Object.keys(mockComments)) {
      const comment = mockComments[postId].find((c) => c.id === comentarioId);
      if (comment) {
        comment.curtiuUsuario = true;
        comment.totalCurtidas = (comment.totalCurtidas || 0) + 1;
        break;
      }
    }
    return mockResponse(ok(null));
  },

  'DELETE /Post/comentario/:id/curtida': (config, [comentarioId]) => {
    for (const postId of Object.keys(mockComments)) {
      const comment = mockComments[postId].find((c) => c.id === comentarioId);
      if (comment) {
        comment.curtiuUsuario = false;
        comment.totalCurtidas = Math.max(0, (comment.totalCurtidas || 0) - 1);
        break;
      }
    }
    return mockResponse(ok(null));
  },

  'POST /Post/comentario': (config) => {
    const body = getBody(config);
    const newComment = {
      id: 'c-' + (++commentCounter),
      postId: body.postId,
      conteudo: body.conteudo,
      usuarioId: currentUser.id,
      usuarioNome: currentUser.nome,
      fotoUsuario: currentUser.fotoPerfil,
      dataCriacao: new Date().toISOString(),
      totalCurtidas: 0,
      curtiuUsuario: false,
    };
    if (!mockComments[body.postId]) mockComments[body.postId] = [];
    mockComments[body.postId].push(newComment);
    const post = mockPosts.find((p) => p.id === body.postId);
    if (post) post.totalComentarios++;
    return mockResponse(ok(newComment));
  },

  'DELETE /Post/comentario/:id': (config, [comentarioId]) => {
    for (const postId of Object.keys(mockComments)) {
      const idx = mockComments[postId].findIndex((c) => c.id === comentarioId);
      if (idx !== -1) {
        mockComments[postId].splice(idx, 1);
        const post = mockPosts.find((p) => p.id === postId);
        if (post) post.totalComentarios = Math.max(0, post.totalComentarios - 1);
        break;
      }
    }
    return mockResponse(ok(null));
  },

  // ── Notificações ──────────────────────────────────────────
  'GET /Notificacao': () => {
    const totalNaoLidas = mockNotifications.filter((n) => !n.lida).length;
    return mockResponse(ok({ notificacoes: mockNotifications, totalNaoLidas }));
  },

  'GET /Notificacao/nao-lidas': () => {
    const unread = mockNotifications.filter((n) => !n.lida);
    return mockResponse(ok({ notificacoes: unread, totalNaoLidas: unread.length }));
  },

  'PUT /Notificacao/:id/marcar-como-lida': (config, [notifId]) => {
    const notif = mockNotifications.find((n) => n.id === notifId);
    if (notif) { notif.lida = true; notif.dataLeitura = new Date().toISOString(); }
    return mockResponse(ok(null));
  },

  'PUT /Notificacao/marcar-todas-como-lidas': () => {
    const now = new Date().toISOString();
    mockNotifications.forEach((n) => { n.lida = true; n.dataLeitura = now; });
    return mockResponse(ok(null));
  },

  'DELETE /Notificacao/:id': (config, [notifId]) => {
    mockNotifications = mockNotifications.filter((n) => n.id !== notifId);
    return mockResponse(ok(null));
  },

  'DELETE /Notificacao': () => {
    mockNotifications = [];
    return mockResponse(ok(null));
  },
};

// ─── Adapter ────────────────────────────────────────────────
// Ordem de matching: rotas mais específicas primeiro
const routeOrder = Object.keys(handlers).sort((a, b) => {
  const aHasParam = a.includes(':');
  const bHasParam = b.includes(':');
  if (aHasParam !== bHasParam) return aHasParam ? 1 : -1;
  return b.length - a.length;
});

export default async function mockAdapter(config) {
  const method = config.method.toUpperCase();
  let url = config.url || '';

  // Remove base URL se presente
  const baseUrl = config.baseURL || '';
  if (url.startsWith(baseUrl)) {
    url = url.slice(baseUrl.length);
  }
  // Remove barra inicial dupla
  if (url.startsWith('/')) url = url.slice(1);
  // Normaliza: remove query string
  const cleanUrl = url.split('?')[0];

  await delay();

  for (const route of routeOrder) {
    const [routeMethod, routePattern] = route.split(' ');
    if (method !== routeMethod) continue;

    const pattern = routePattern.startsWith('/') ? routePattern.slice(1) : routePattern;
    const params = match(cleanUrl, pattern);

    if (params !== null) {
      const response = handlers[route](config, params);
      response.config = config;
      console.log(`[Mock] ${method} /${cleanUrl}`, response.data?.dados ? '✓' : '');
      return response;
    }
  }

  console.warn(`[Mock] Rota não mapeada: ${method} /${cleanUrl}`);
  return mockResponse({ sucesso: false, dados: null, mensagem: 'Rota não encontrada (mock)', erros: [] }, 404);
}
