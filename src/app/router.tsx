import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

const Home = lazy(() => import("../domains/home/pages/HomePage"));
const About = lazy(() => import("../domains/about/pages/AboutPage"));
const Services = lazy(() => import("../domains/services/pages/ServicesPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
    ],
  },
]);
