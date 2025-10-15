import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { AuthGate } from "./AuthGate";
import SplashScreen from "@/shared/components/SplashScreen";

export const ProtectedLayout = () => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  const isValidToken = token;

  return (
    <AuthGate>
      {isValidToken ? <Outlet /> : <Navigate to="/auth/login" />}
    </AuthGate>
  );
};
