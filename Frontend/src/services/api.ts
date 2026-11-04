import { auth } from "../firebase";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://mymemo-reactandtypescript.onrender.com"
).replace(/\/$/, "");

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("Faça login para acessar seus dados.");
  }

  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}
