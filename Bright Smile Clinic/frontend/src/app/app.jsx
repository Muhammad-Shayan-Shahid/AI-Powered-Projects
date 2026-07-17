import { Provider } from 'react-redux';
import { store } from './app.store';
import AppRoutes from './app.routes';
import './app.css';

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
