import MenuBottom from "@/shared/components/MenuBottom";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex flex-col items-center justify-between h-screen w-screen pb-[80px]">
      {/* Contenido principal */}
      <div className="flex-1 w-full overflow-y-auto p-4">
        <Outlet />
      </div>

      {/* Menú inferior flotante */}
      <MenuBottom />
    </div>
  );
}
