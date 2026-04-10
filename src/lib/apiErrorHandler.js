import toast from 'react-hot-toast';

const ERROR_MESSAGES = {
  400: 'Dados inválidos. Verifique os campos e tente novamente.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para essa ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito: esse registro já existe.',
  422: 'Dados inválidos. Verifique os campos.',
  429: 'Muitas requisições. Aguarde um momento.',
  500: 'Erro interno no servidor. Tente novamente mais tarde.',
};

export function handleApiError(error) {
  if (error.response?.status === 401) return;

  const serverMessage = error.response?.data?.mensagem
    || error.response?.data?.erros?.[0];

  const statusMessage = ERROR_MESSAGES[error.response?.status];

  const message = serverMessage || statusMessage || 'Erro de conexão. Verifique sua internet.';

  toast.error(message);
}
