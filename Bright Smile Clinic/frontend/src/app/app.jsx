import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app.store';
import AppRoutes from './app.routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import './app.css';

// Restores the session from the httpOnly cookie on first load, before any
// ProtectedRoute makes a redirect decision.
function AuthBootstrap({ children }) {
  const { getMe } = useAuth();

  useEffect(() => {
    getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        <AppRoutes />
      </AuthBootstrap>
    </Provider>
  );
}
