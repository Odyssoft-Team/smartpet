import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useLogin() {
  const { setCurrentUser, setToken, saveUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("Error al iniciar sesión", { description: error.message });
      return;
    }

    const token = data.session?.access_token;
    const user = data.user?.email;

    if (token && user) {
      setToken(token);
      setCurrentUser(user);
      saveUser(user);
      toast.success("Inicio de sesión exitoso", {
        description: `Bienvenido ${user}`,
      });
      navigate("/");
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) toast.error(error.message);
  };

  return { loginWithEmail, loginWithGoogle, loading };
}
