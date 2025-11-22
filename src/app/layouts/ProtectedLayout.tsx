import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { AuthGate } from "./AuthGate";
import SplashScreen from "@/shared/components/SplashScreen";
import { Toaster } from "sonner";

export const ProtectedLayout = () => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  const isValidToken = token;

  return (
    <AuthGate>
      <Toaster
        richColors
        visibleToasts={1}
        position="top-right"
        theme="light"
      />
      {isValidToken ? <Outlet /> : <Navigate to="/auth/login" />}
    </AuthGate>
  );
};
