import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { clearAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuth();
    logout();
    navigate("/auth/login");
  };
  return (
    <div>
      <h1>Profile Page</h1>
      <Button
        variant={"destructive"}
        onClick={handleLogout}
        className="mt-2 w-full"
      >
        Cerrar Sesi&oacute;n
      </Button>
    </div>
  );
}
