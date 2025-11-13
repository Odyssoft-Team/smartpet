import MenuBottom from "@/shared/components/MenuBottom";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-screen pb-[70px]">
      {/* Contenido principal */}
      <div className="flex-1 w-full overflow-y-auto px-4 pt-4 pb-2">
        <Outlet />
      </div>

      {/* Menú inferior flotante */}
      <MenuBottom />
    </div>
  );
}
