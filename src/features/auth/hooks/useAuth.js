import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { queryClient } from '../../../lib/queryClient';

function extractError(err) {
  const data = err.response?.data;
  if (data?.erros?.length) return data.erros[0];
  if (data?.mensagem) return data.mensagem;
  return 'Algo deu errado. Tente novamente.';
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (!data.sucesso) {
        toast.error(data.mensagem || 'Erro ao fazer login');
        return;
      }
      setAuth(data.dados);
      const redirectTo = location.state?.from?.pathname || '/feed';
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (!data.sucesso) {
        toast.error(data.mensagem || 'Erro ao criar conta');
        return;
      }
      toast.success('Conta criada! Verifique seu email para confirmar.');
      navigate('/login');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: authService.confirmEmail,
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success('Email confirmado com sucesso!');
      }
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useResendConfirmation() {
  return useMutation({
    mutationFn: authService.resendConfirmation,
    onSuccess: (data) => {
      if (data?.sucesso) {
        toast.success(data.mensagem || 'Email de confirmação reenviado');
      } else if (data?.mensagem) {
        // backend may return message without sucesso flag
        toast.success(data.mensagem);
      } else {
        toast.success('Pedido de confirmação enviado');
      }
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      if (data?.sucesso) {
        toast.success(data.mensagem || 'Email enviado para redefinição de senha');
      } else if (data?.mensagem) {
        toast.success(data.mensagem);
      } else {
        toast.success('Email enviado para redefinição de senha');
      }
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      if (!data.sucesso) {
        toast.error(data.mensagem || 'Erro ao redefinir senha');
        return;
      }
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success('Senha alterada com sucesso!');
      } else {
        toast.error(data.mensagem || 'Erro ao alterar senha');
      }
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useDeleteAccount() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: (data) => {
      if (data.sucesso) {
        clearAuth();
        queryClient.clear();
        toast.success('Conta deletada com sucesso');
        navigate('/login');
      } else {
        toast.error(data.mensagem || 'Erro ao deletar conta');
      }
    },
    onError: (err) => toast.error(extractError(err)),
  });
}
