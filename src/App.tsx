import { useState, useEffect } from 'react'
import './App.css'
import AppLoader from './shared/components/AppLoader';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento da página por 3 segundos

    console.log("Iniciando timer...");
    const timer = setTimeout(() => {
      console.log("Timer finalizado, mudando loading para false");
      setIsLoading(false);
    }, 100); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App
