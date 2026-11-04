import { createBrowserRouter } from "react-router-dom";
import AuthGate from "./components/AuthGate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGate />,
  },
],
  {
    basename: "/"
  }
); 