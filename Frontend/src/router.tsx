import { createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  { 
    path: "/about", 
    element: <div>About</div> 
  },
],
  {
    basename: "/MyMemo_ReactAndTypescript"
  }
); 