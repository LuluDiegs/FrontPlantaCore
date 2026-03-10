import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';

export default function AuthGuard() {
  const tokens = useAuthStore((s) => s.tokens);
  const location = useLocation();

  if (!tokens?.tokenAcesso) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

