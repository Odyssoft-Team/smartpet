import SplashScreen from "@/shared/components/SplashScreen";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { hasHydrated, token, logout } = useAuthStore();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (hasHydrated) {
      if (!token) {
        console.log("Token not found. Redirecting to login");
        logout();
      }

      setReady(true);
    }
  }, [hasHydrated, token, logout]);

  if (!ready) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
