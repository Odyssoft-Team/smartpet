import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen flex items-center justify-start bg-white">
      <Toaster richColors visibleToasts={1} theme="light" />
      <Outlet />
    </div>
  );
}
