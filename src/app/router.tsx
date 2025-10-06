import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtedtedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import AppLayout from "./layouts/AppLayout";
import MypetsPage from "@/domains/mypets/pages/MypetsPage";
import RegistermypetsPage from "@/domains/mypets/pages/RegisterPage";

//const HomePage = lazy(() => import("../domains/home/pages/HomePage"));
const AboutPage = lazy(() => import("../domains/about/pages/AboutPage"));
const ServicesPage = lazy(
  () => import("../domains/services/pages/ServicesPage")
);
const RegisterPage = lazy(() => import("@/domains/auth/pages/RegisterPage"));
const LoginPage = lazy(() => import("@/domains/auth/pages/LoginPage"));

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
          //{ path: "/", element: <HomePage /> },
          { path: "/", element: <RegisterPage /> },
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
    ],
  },
]);
