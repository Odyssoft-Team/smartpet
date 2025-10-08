import { Link, useLocation } from "react-router-dom";

import { HiHome } from "react-icons/hi2";
import { FaBell, FaPaw, FaShoppingCart, FaUser } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function MenuBottom() {
  const location = useLocation();

  const menuItems = [
    { to: "/", label: "Inicio", icon: HiHome },
    { to: "/mypets", label: "Servicios", icon: FaPaw },
    { to: "/shopping", label: "Compras", icon: FaShoppingCart },
    { to: "/notifications", label: "Notificaciones", icon: FaBell },
    { to: "/profile", label: "Perfil", icon: FaUser },
  ];
  return (
    <nav
      className="
          fixed bottom-0 left-0 right-0
          flex justify-around items-center
          bg-white border-t border-gray-200
          h-16 shadow-md z-50
          pb-[env(safe-area-inset-bottom)]
        "
    >
      {menuItems.map(({ to, icon: Icon }) => {
        const isActive = location.pathname === to;

        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center justify-center text-sm transition-all duration-200"
            )}
          >
            <Icon
              size={22}
              className={cn(
                "mb-1 transition-transform duration-200",
                isActive ? "scale-120 text-primary" : "text-muted-foreground"
              )}
            />
            {/* <span className="text-xs font-medium">{label}</span> */}
          </Link>
        );
      })}
    </nav>
  );
}
