import { createBrowserRouter, Navigate } from "react-router-dom";
import WelcomePage from "./page/welcomePage";
import TodoPage from "./page/todoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/todo",
    element: <TodoPage />,
  },
]);

export default router;