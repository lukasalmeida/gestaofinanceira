import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from 'contexts/AuthContext';

export default function GuestRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
