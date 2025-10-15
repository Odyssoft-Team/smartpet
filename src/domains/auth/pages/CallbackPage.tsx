import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/"); // o al home que tengas
      } else {
        navigate("/auth/login");
      }
    };

    handleSession();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin" size={24} />
      <span className="ml-2">Validando acceso...</span>
    </div>
  );
}
