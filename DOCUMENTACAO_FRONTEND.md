# PlantID — Documentação Frontend

## Responsável: Frontend
## usado: React 18 + Vite + React Router v6 + TanStack React Query + Zustand + CSS Modules


### Fluxo JWT
- Token de acesso armazenado em Zustand (persistido em `localStorage` com chave `plantid-auth`)
- Refresh token armazenado no mesmo store
- **Auto-refresh:** ao receber `401`, o interceptor axios tenta renovar o token antes de rejeitar a requisição
- Requisições que falharam durante o refresh são enfileiradas e reexecutadas automaticamente após o token ser renovado
- Em caso de falha no refresh: limpa o store e redireciona para `/login`

### Arquivos relevantes
- `src/lib/axios.js` — interceptors de request (injeta Bearer) e response (trata 401)
- `src/features/auth/stores/authStore.js` — estado global com Zustand
- `src/features/auth/services/authService.js` — chamadas à API de autenticação

### Endpoints consumidos
```
POST /Autenticacao/login
POST /Autenticacao/registrar
POST /Autenticacao/confirmar-email
POST /Autenticacao/resetar-senha
POST /Autenticacao/nova-senha
POST /Autenticacao/reenviar-confirmacao
POST /Autenticacao/logout
POST /Autenticacao/refresh-token
```

### Funcionalidades implementadas
- **Feed** com scroll infinito (posts de usuários seguidos)
- **Explorar** com scroll infinito (todos os posts públicos)
- **Criar post** vinculado a uma planta da coleção do usuário
- **Detalhe do post** com seção de comentários
- **Editar post** (modal com textarea pré-preenchida, indica `· editado` após salvar)
- **Excluir post** com confirmação
- **Curtir / descurtir** com atualização otimista (UI atualiza antes da resposta do servidor)
- **Comentar** com limite de 1000 caracteres
- **Curtir comentários** com animação heartPop e atualização otimista
- **Excluir comentário** (apenas o autor)

### Atualização otimista de curtidas
Para curtir posts e comentários, o frontend atualiza o cache local imediatamente sem esperar resposta do servidor. Em caso de erro, o cache é revertido automaticamente.

### Arquivos relevantes
- `src/features/posts/services/postService.js`
- `src/features/posts/hooks/usePosts.js`
- `src/features/posts/components/PostCard.jsx`
- `src/features/posts/components/PostHeader.jsx`
- `src/features/posts/components/PostActions.jsx`
- `src/features/posts/components/PostComments.jsx`
- `src/features/posts/components/EditPostModal.jsx`

### Endpoints consumidos
```
POST   /Post
PUT    /Post/{postId}
DELETE /Post/{postId}
GET    /Post/{postId}
GET    /Post/feed?pagina=1&tamanho=10
GET    /Post/explorar?pagina=1&tamanho=10
GET    /Post/usuario/{usuarioId}?pagina=1&tamanho=10
POST   /Post/{postId}/curtir
DELETE /Post/{postId}/curtida
GET    /Post/{postId}/comentarios?pagina=1&tamanho=20
POST   /Post/comentario
DELETE /Post/comentario/{comentarioId}
POST   /Post/comentario/{comentarioId}/curtir
DELETE /Post/comentario/{comentarioId}/curtida
```

### Funcionalidades implementadas
- **Identificar planta** por upload de imagem (JPG, PNG, WEBP — máx. 5MB)
- **Buscar planta** no banco Trefle por nome comum ou científico
- **Adicionar planta** à coleção a partir do resultado da busca
- **Minhas plantas** em grid com paginação (12 por página)
- **Detalhe da planta:** nome comum, nome científico, família, gênero, data de identificação, foto, descrição, requisitos de cuidado (luz, água, temperatura), informações de toxicidade
- **Lembrete de cuidado** gerado automaticamente via backend
- **Excluir planta** com confirmação em modal

### Arquivos relevantes
- `src/features/plants/services/plantService.js`
- `src/features/plants/hooks/usePlants.js`
- `src/features/plants/components/PlantCard.jsx`
- `src/features/plants/components/PlantCareInfo.jsx`
- `src/features/plants/components/ToxicityBanner.jsx`

### Endpoints consumidos
```
POST   /Planta/identificar          (multipart/form-data com a imagem)
POST   /Planta/buscar               (body: { nome, pagina })
POST   /Planta/buscar/adicionar     (body: dados da planta do Trefle)
GET    /Planta/minhas-plantas?pagina=1&tamanho=12
GET    /Planta/{plantaId}
DELETE /Planta/{plantaId}
POST   /Planta/{plantaId}/gerar-lembrete-cuidado
```

### Funcionalidades implementadas
- **Meu perfil** com abas: Posts, Seguidores, Seguindo
- **Perfil público** de outros usuários (mesmas abas + botão seguir/deixar de seguir)
- **Editar perfil:** nome, biografia e foto de perfil (upload para Supabase via backend)
- **Seguir / deixar de seguir** com atualização otimista
- Contadores de seguidores, seguindo, plantas e posts exibidos no header do perfil

### Arquivos relevantes
- `src/features/profile/services/profileService.js`
- `src/features/profile/hooks/useProfile.js`
- `src/features/profile/components/ProfileHeader.jsx`
- `src/features/profile/components/ProfileTabs.jsx`
- `src/features/profile/components/UserList.jsx`

### Endpoints consumidos
```
GET    /Usuario/perfil
GET    /Usuario/perfil-publico/{usuarioId}
PUT    /Usuario/nome               (body: { nome })
PUT    /Usuario/biografia          (body: { biografia })
POST   /Usuario/foto-perfil        (multipart/form-data)
POST   /Usuario/seguir/{usuarioId}
DELETE /Usuario/seguir/{usuarioId}
GET    /Usuario/{usuarioId}/seguidores?pagina=1&tamanho=20
GET    /Usuario/{usuarioId}/seguindo?pagina=1&tamanho=20
```

---


### Notificações Funcionalidades implementadas
- Listagem de todas as notificações com tipo, mensagem, usuário de origem e timestamp
- Badge de não lidas no header atualizado a cada **60 segundos** automaticamente
- Marcar notificação individual como lida
- Marcar todas como lidas
- Excluir notificação individual
- Excluir todas as notificações
- Tipos suportados: `NovoSeguidor`, `Curtida`, `Comentario`, `LembreteCuidado`, `AlertaToxicidade`

### Arquivos relevantes
- `src/features/notifications/services/notificationService.js`
- `src/features/notifications/hooks/useNotifications.js`
- `src/features/notifications/components/NotificationItem.jsx`
- `src/features/notifications/components/NotificationBadge.jsx`

### Endpoints consumidos
```
GET    /Notificacao
GET    /Notificacao/nao-lidas
PUT    /Notificacao/{notificacaoId}/marcar-como-lida
PUT    /Notificacao/marcar-todas-como-lidas
DELETE /Notificacao/{notificacaoId}
DELETE /Notificacao
```

---

## Formato de resposta esperado da API

Todas as respostas devem seguir o wrapper:
```json
{
  "sucesso": true,
  "dados": { },
  "mensagem": "",
  "erros": []
}
```

Respostas paginadas devem ter o formato:
```json
{
  "sucesso": true,
  "dados": {
    "itens": [],
    "pagina": 1,
    "tamanho": 10,
    "total": 42,
    "totalPaginas": 5,
    "temProxima": true,
    "temAnterior": false
  }
}
```


## Gerenciamento de estado

### Zustand (estado global persistido)
Usado exclusivamente para autenticação:
```js
{
  user: { id, nome, email },
  tokens: { tokenAcesso, tokenRefresh },
  isAuthenticated: boolean,
  setAuth(loginData),
  updateUser(userData),
  clearAuth()
}
```

### TanStack React Query (estado do servidor)
Todos os dados da API são gerenciados via React Query com:
- Cache automático com invalidação cirúrgica após mutações
- Retry automático em caso de falha
- Skeleton loaders durante carregamento
- Estados de erro tratados com toast



## Integrações externas (gerenciadas pelo backend)

O frontend não chama essas APIs diretamente — apenas envia dados ao backend que os processa:

| Serviço | Uso |
|---|---|
| **PlantNet API** | Identificação de plantas por imagem |
| **Trefle API** | Busca de plantas por nome |
| **Google Gemini** | Descrição enriquecida e lembretes de cuidado |
| **Supabase Storage** | Armazenamento de fotos de perfil e plantas |
| **SMTP Gmail** | Confirmação de email e reset de senha |
