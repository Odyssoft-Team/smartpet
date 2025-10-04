import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-10">
      <div className="flex flex-1 flex-col gap-20 w-full h-full">
        <div className="w-full flex items-center justify-center gap-8">
          <Link to="/">Inicio</Link>
          <Link to="/about">Nosotros</Link>
          <Link to="/services">Servicios</Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
