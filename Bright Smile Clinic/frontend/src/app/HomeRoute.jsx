import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import Home from '../features/public/pages/Home';
import { DASHBOARD_PATH_BY_ROLE } from './ProtectedRoute';

// Wraps the "/" route only. An already-logged-in visitor lands on their own
// dashboard instead of the marketing Home page; everyone else (including the
// brief isInitializing window on refresh) sees Home as normal. Deliberately
// not reused by Browse Doctors/Services/Doctor Profile/Contact — those stay
// accessible to logged-in patients at any time.
export default function HomeRoute() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return <Home />;
  }

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_PATH_BY_ROLE[user.role] || '/'} replace />;
  }

  return <Home />;
}
