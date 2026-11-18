import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import "../styles/LoginPage.css";
import Logo from "../components/Logo";

export default function LoginPage() {
  const { configured, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  async function handleGoogleSignIn() {
    setError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (signInError) {
      console.error("Erro no login Google:", signInError);
      setError("Não foi possível entrar com Google. Tente novamente.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Logo size={240} />
        <br />
        <p>Acesse seus decks e cards de qualquer dispositivo</p>
        {!configured ? (
          <p role="alert" className="login-error">
            A autenticação ainda não foi configurada. Defina as variáveis
            VITE_FIREBASE_* no ambiente do frontend.
          </p>
        ) : (
          <>
            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
            >
              {signingIn ? "Conectando..." : "Continuar com Google"}
            </button>
            {error && <p role="alert" className="login-error">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
}
