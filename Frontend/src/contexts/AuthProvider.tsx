import { useEffect, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    if (!auth) {
      throw new Error("Autenticação Firebase não está configurada.");
    }
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logOut() {
    if (!auth) {
      throw new Error("Autenticação Firebase não está configurada.");
    }
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, configured: isFirebaseConfigured, signInWithGoogle, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
