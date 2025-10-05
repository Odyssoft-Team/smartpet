import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { AuthGate } from "./AuthGate";

export const ProtectedLayout = () => {
  const { token } = useAuthStore();

  const isValidToken = token;

  return (
    <AuthGate>
      {isValidToken ? <Outlet /> : <Navigate to="/auth/login" />}
    </AuthGate>
  );
};
