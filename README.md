# PlantCore
#PRECISA MUDAR O NOME PARA PLANTACORE
# Endpoints Consumidos pelo Front-End

## Autenticação (`/Autenticacao` e `/Usuario`)
- **POST** `/Autenticacao/login` — Login do usuário
- **POST** `/Autenticacao/registrar` — Cadastro de novo usuário
- **POST** `/Autenticacao/confirmar-email` — Confirmação de e-mail
- **POST** `/Autenticacao/resetar-senha` — Solicitar redefinição de senha
- **POST** `/Autenticacao/nova-senha` — Redefinir senha
- **POST** `/Autenticacao/reenviar-confirmacao` — Reenviar confirmação de e-mail
- **POST** `/Autenticacao/logout` — Logout
- **POST** `/Autenticacao/trocar-senha` — Trocar senha
- **DELETE** `/Usuario/conta` — Excluir conta

## Perfil de Usuário (`/Usuario`)
- **GET** `/Usuario/perfil` — Buscar perfil do usuário logado
- **GET** `/Usuario/perfil-publico/{usuarioId}` — Buscar perfil público de outro usuário
- **PUT** `/Usuario/nome` — Atualizar nome
- **PUT** `/Usuario/biografia` — Atualizar biografia
- **POST** `/Usuario/foto-perfil` — Atualizar foto de perfil
- **POST** `/Usuario/seguir/{usuarioId}` — Seguir usuário
- **DELETE** `/Usuario/seguir/{usuarioId}` — Deixar de seguir usuário
- **GET** `/Usuario/{usuarioId}/seguidores` — Listar seguidores
- **GET** `/Usuario/{usuarioId}/seguindo` — Listar seguindo

## Notificações (`/Notificacao`)
- **GET** `/Notificacao` — Listar todas as notificações
- **GET** `/Notificacao/nao-lidas` — Listar notificações não lidas
- **PUT** `/Notificacao/{notificacaoId}/marcar-como-lida` — Marcar notificação como lida
- **PUT** `/Notificacao/marcar-todas-como-lidas` — Marcar todas como lidas
- **DELETE** `/Notificacao/{notificacaoId}` — Excluir notificação
- **DELETE** `/Notificacao` — Excluir todas as notificações

## Plantas (`/Planta`)
- **POST** `/Planta/identificar` — Identificar planta por imagem
- **POST** `/Planta/buscar` — Buscar plantas por nome
- **POST** `/Planta/buscar/adicionar` — Adicionar planta encontrada na busca
- **GET** `/Planta/minhas-plantas` — Listar plantas do usuário
- **GET** `/Planta/{plantaId}` — Detalhes de uma planta
- **DELETE** `/Planta/{plantaId}` — Remover planta
- **POST** `/Planta/{plantaId}/gerar-lembrete-cuidado` — Gerar lembrete de cuidado para planta

## Lembretes de Cuidado (`/lembretes-cuidado`)
- **POST** `/lembretes-cuidado/gerar-para-todas-plantas` — Gerar lembretes para todas as plantas

## Posts e Comentários (`/Post`)
- **POST** `/Post` — Criar post
- **PUT** `/Post/{postId}` — Editar post
- **DELETE** `/Post/{postId}` — Excluir post
- **GET** `/Post/{postId}` — Detalhes do post
- **GET** `/Post/feed` — Feed de posts
- **GET** `/Post/explorar` — Explorar posts
- **GET** `/Post/usuario/{usuarioId}` — Posts de um usuário
- **POST** `/Post/{postId}/curtir` — Curtir post
- **DELETE** `/Post/{postId}/curtida` — Remover curtida do post

### Comentários
- **GET** `/Post/{postId}/comentarios` — Listar comentários do post
- **POST** `/Post/comentario` — Criar comentário
- **DELETE** `/Post/comentario/{comentarioId}` — Excluir comentário
- **POST** `/Post/comentario/{comentarioId}/curtir` — Curtir comentário
- **DELETE** `/Post/comentario/{comentarioId}/curtida` — Remover curtida do comentário
