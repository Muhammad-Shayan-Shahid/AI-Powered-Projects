import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

// Maps a role to where an unauthenticated visitor for that area should be sent to log in.
const LOGIN_PATH_BY_ROLE = {
  patient: '/login',
  doctor: '/doctor/login',
  admin: '/admin/login',
};

// Maps a role to that role's own dashboard, for bouncing an already-logged-in
// user out of a route meant for a different role (they don't need a login page).
const DASHBOARD_PATH_BY_ROLE = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

// Gates a route on being logged in (and optionally on role). Waits for the
// initial getMe() check to resolve before deciding, so a page refresh doesn't
// bounce a logged-in user back to the login screen.
export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    const fallbackRole = roles?.[0] || 'patient';
    return <Navigate to={LOGIN_PATH_BY_ROLE[fallbackRole]} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={DASHBOARD_PATH_BY_ROLE[user.role] || '/'} replace />;
  }

  return children;
}
