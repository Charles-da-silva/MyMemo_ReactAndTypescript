import { useEffect, useState } from "react";
import "./App.css";
import AppLoader from './components/AppLoader';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthProvider';
import { API_BASE_URL } from "./services/api";
import { useAuth } from "./contexts/authContext";

function BackendWakeGate() {
  const { loading: authLoading } = useAuth();
  const [bootState, setBootState] = useState<"loading" | "ready" | "error">("loading");
  const [bootError, setBootError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [minimumLoadComplete, setMinimumLoadComplete] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const minimumLoadTimer = window.setTimeout(() => {
      if (active) {
        setMinimumLoadComplete(true);
      }
    }, 9000);
    const timeout = window.setTimeout(() => controller.abort(), 120_000);

    async function wakeBackend() {
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`O servidor respondeu com HTTP ${response.status}.`);
        }
        await response.json();
        if (active) {
          setBootState("ready");
          setBootError(null);
        }
      } catch (error) {
        if (!active) {
          return;
        }
        console.error("Erro ao iniciar o backend:", error);
        setBootError(
          error instanceof DOMException && error.name === "AbortError"
            ? "O servidor demorou para responder. Tente novamente."
            : error instanceof Error
              ? error.message
              : "Não foi possível conectar ao servidor.",
        );
        setBootState("error");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void wakeBackend();

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(minimumLoadTimer);
      window.clearTimeout(timeout);
    };
  }, [retryCount]);

  if (bootState === "error" && minimumLoadComplete) {
    return (
      <AppLoader
        message="O sistema não conseguiu iniciar."
        error={bootError}
        onRetry={() => {
          setBootState("loading");
          setMinimumLoadComplete(false);
          setRetryCount(count => count + 1);
        }}
      />
    );
  }

  if (bootState === "loading" || authLoading || !minimumLoadComplete) {
    return <AppLoader message="Iniciando o sistema..." />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <BackendWakeGate />
    </AuthProvider>
  );
}

export default App
