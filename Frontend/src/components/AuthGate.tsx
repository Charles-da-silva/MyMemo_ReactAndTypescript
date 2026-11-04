import AppLoader from "./AppLoader";
import { useAuth } from "../contexts/authContext";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";

export default function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  return user ? <MainPage /> : <LoginPage />;
}
