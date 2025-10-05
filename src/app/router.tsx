import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtedtedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";

const HomePage = lazy(() => import("../domains/home/pages/HomePage"));
const AboutPage = lazy(() => import("../domains/about/pages/AboutPage"));
const ServicesPage = lazy(
  () => import("../domains/services/pages/ServicesPage")
);
const RegistroPage = lazy(
  () => import("@/domains/registro/pages/RegistroPage")
);
const LoginPage = lazy(() => import("@/domains/auth/pages/LoginPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/registro", element: <RegistroPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
]);
