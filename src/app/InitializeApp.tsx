import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function InitializeApp() {
  return <RouterProvider router={router} />;
}
