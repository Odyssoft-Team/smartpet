import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}