import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './app.store';
import AppRoutes from './app.routes';
import NotificationListener from './NotificationListener';
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
        <NotificationListener />
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={5000} />
      </AuthBootstrap>
    </Provider>
  );
}
