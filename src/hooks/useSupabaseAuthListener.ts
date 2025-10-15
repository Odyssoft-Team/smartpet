import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth.store";

export const useSupabaseAuthListener = () => {
  const { setToken, setCurrentUser, startLoading, stopLoading, logout } =
    useAuthStore();

  useEffect(() => {
    startLoading();

    // 👇 Carga sesión actual al iniciar la app
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      if (session) {
        const { access_token, user } = session;
        setToken(access_token);
        setCurrentUser(user?.email || null);
      } else {
        logout();
      }
      stopLoading();
    });

    // 👇 Escucha cambios en tiempo real (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const { access_token, user } = session;
          setToken(access_token);
          setCurrentUser(user?.email || null);
        } else {
          logout();
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setToken, setCurrentUser, startLoading, stopLoading, logout]);
};
