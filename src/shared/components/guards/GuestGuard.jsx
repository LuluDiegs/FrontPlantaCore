import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';

export default function GuestGuard() {
  const tokens = useAuthStore((s) => s.tokens);

  if (tokens?.tokenAcesso) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
}
