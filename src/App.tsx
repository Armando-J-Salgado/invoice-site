import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { ToastProvider } from './common/components/Toast';
import { useAuthStore } from './contexts/auth/authStore';

export function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
