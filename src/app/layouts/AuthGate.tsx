import SplashScreen from "@/shared/components/SplashScreen";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { hasHydrated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasHydrated) {
      setReady(true);
    }
  }, [hasHydrated]);

  if (!ready) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
