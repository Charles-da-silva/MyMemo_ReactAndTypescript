import { useState, useEffect } from 'react'
import './App.css'
import AppLoader from './shared/components/AppLoader';

function App() {
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento da página por 3 segundos

    console.log("Iniciando timer...");
    const timer = setTimeout(() => {
      console.log("Timer finalizado, mudando loading para false");
      setIsLoading(false);
    }, 10000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <div className="App">
      <h1>Conteúdo da Página Carregado!</h1>
    </div>
  );
}

export default App
