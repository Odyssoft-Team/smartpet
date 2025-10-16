import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useSupabaseAuthListener } from "@/hooks/useSupabaseAuthListener";

export function InitializeApp() {
  useSupabaseAuthListener(); // 👈 se activa globalmente una sola vez
  return <RouterProvider router={router} />;
}
