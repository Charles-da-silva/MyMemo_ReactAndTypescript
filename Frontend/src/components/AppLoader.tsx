import { useEffect, useState } from "react";
import Logo from "./Logo";
import "../styles/AppLoader.css";

interface AppLoaderProps {
  message?: string;
  compact?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function AppLoader({
  message = "Iniciando o sistema...",
  compact = false,
  error,
  onRetry,
}: AppLoaderProps) {
  const loadingMessage = message.replace(/[.]+$/, "").trim();
  const [typedLength, setTypedLength] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (error) {
      return;
    }

    if (typedLength < loadingMessage.length) {
      const timer = window.setTimeout(() => {
        setTypedLength((length) => length + 1);
      }, 70);
      return () => window.clearTimeout(timer);
    }

    if (dotCount < 3) {
      const timer = window.setTimeout(() => {
        setDotCount((count) => count + 1);
      }, 320);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setTypedLength(0);
      setDotCount(0);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [dotCount, error, loadingMessage, typedLength]);

  return (
    <div className={`mainPage appLoader${compact ? " appLoader--compact" : ""}`}>
      <Logo isLoading={!compact && !error} size={compact ? 150 : 260} />
      <p className="appLoader__message" role="status" aria-live="polite">
        {error
          ? message
          : `${loadingMessage.slice(0, typedLength)}${".".repeat(dotCount)}`}
      </p>
      {error && (
        <div className="appLoader__error">
          <p role="alert">{error}</p>
          {onRetry && (
            <button type="button" className="btn btn-blue" onClick={onRetry}>
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
