import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtedtedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import AppLayout from "./layouts/AppLayout";
import MypetsPage from "@/domains/mypets/pages/MypetsPage";
import RegistermypetsPage from "@/domains/mypets/pages/RegisterPage";

const HomePage = lazy(() => import("../domains/home/pages/HomePage"));
const AboutPage = lazy(() => import("../domains/about/pages/AboutPage"));
const ServicesPage = lazy(
  () => import("../domains/services/pages/ServicesPage")
);
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
          { path: "/about", element: <AboutPage /> },
          { path: "/services", element: <ServicesPage /> },
          { path: "/mypets", element: <MypetsPage /> },
          { path: "/registermypets", element: <RegistermypetsPage /> },
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
