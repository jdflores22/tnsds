import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { TOKEN_KEY } from '@/constants/api';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  const hasToken = Boolean(accessToken || localStorage.getItem(TOKEN_KEY));

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
