import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtedtedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import AppLayout from "./layouts/AppLayout";
import MypetsPage from "@/domains/mypets/pages/MypetsPage";
import RegistermypetsPage from "@/domains/mypets/pages/RegisterPage";
import Perfil1 from "@/domains/mypets/perfil/Perfil1";
import Perfil2 from "@/domains/mypets/perfil/Perfil2";
import Perfil3 from "@/domains/mypets/perfil/Perfil3";

const HomePage = lazy(() => import("../domains/home/pages/HomePage"));
const ServicesPage = lazy(
  () => import("../domains/services/pages/ServicesPage")
);
const GroomingPage = lazy(
  () => import("../domains/services/pages/GroomingPage")
);
const GroomingServicesPage = lazy(
  () => import("../domains/services/pages/GroomingServicesPage")
);
const ShoppingPage = lazy(
  () => import("../domains/shopping/pages/ShoppingPage")
);
const NotificationsPage = lazy(
  () => import("../domains/notifications/pages/NotificationsPage")
);
const ProfilePage = lazy(() => import("../domains/profile/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/domains/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/domains/auth/pages/RegisterPage"));
const RegisterNamePage = lazy(
  () => import("@/domains/auth/pages/RegisterNamePage")
);
const RegisterPhonePage = lazy(
  () => import("@/domains/auth/pages/RegisterPhonePage")
);
const RegisterSmsPage = lazy(
  () => import("@/domains/auth/pages/RegisterSmsPage")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/services", element: <ServicesPage /> },
          { path: "/services/grooming", element: <GroomingPage /> },
          { path: "/services/grooming/2", element: <GroomingServicesPage /> },
          { path: "/shopping", element: <ShoppingPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/mypets", element: <MypetsPage /> },
          { path: "/registermypets", element: <RegistermypetsPage /> },
          { path: "/perfil-fidel", element: <Perfil1 /> },
          { path: "/perfil-trufa", element: <Perfil2 /> },
          { path: "/perfil-olivia", element: <Perfil3 /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "register/name", element: <RegisterNamePage /> },
      { path: "register/phone", element: <RegisterPhonePage /> },
      { path: "register/sms", element: <RegisterSmsPage /> },
    ],
  },
]);
