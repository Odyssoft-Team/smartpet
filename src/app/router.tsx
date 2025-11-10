import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtedtedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import AppLayout from "./layouts/AppLayout";
import MypetsPage from "@/domains/mypets/pages/MypetsPage";
import RegistermypetsPage from "@/domains/mypets/pages/RegisterPage";
import AddressPage from "@/domains/address/pages/AddressPage";

const RegisterPetStep1 = lazy(() =>
  import("@/domains/mypets/pages/RegisterPetStep1")
);
const RegisterPetStep2 = lazy(() =>
  import("@/domains/mypets/pages/RegisterPetStep2")
);
const RegisterPetStep3 = lazy(() =>
  import("@/domains/mypets/pages/RegisterPetStep3")
);
const RegisterPetStep4 = lazy(() =>
  import("@/domains/mypets/pages/RegisterPetStep4")
);
const RegisterPetStep5 = lazy(() =>
  import("@/domains/mypets/pages/RegisterPetStep5")
);

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
const GroomingCalendarPage = lazy(
  () => import("../domains/services/pages/GroomingCalendarPage")
);
const ShoppingPage = lazy(
  () => import("../domains/shopping/pages/ShoppingPage")
);
const NotificationsPage = lazy(
  () => import("../domains/notifications/pages/NotificationsPage")
);
const ActivitiesPage = lazy(
  () => import("../domains/activities/pages/ActivitiesPage")
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
const RegisterEmailVerificationPage = lazy(
  () => import("@/domains/auth/pages/RegisterEmailVerificationPage")
);

const EditmypetsPage = lazy(() => import("../domains/mypets/pages/EditPage"));
const PetProfilePage = lazy(() => import("../domains/mypets/pages/PetProfilePage"));

const CallbackPage = lazy(() => import("@/domains/auth/pages/CallbackPage"));

// ------------------ LIVE STREAM ------------------
const LiveHomePage = lazy(() => import("@/domains/live/pages/HomePage"));
const LiveHostPage = lazy(() => import("@/domains/live/pages/HostPage"));
const LiveViewerPage = lazy(() => import("@/domains/live/pages/ViewerPage"));

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
          { path: "/services/grooming/3", element: <GroomingCalendarPage /> },
          { path: "/shopping", element: <ShoppingPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/activities", element: <ActivitiesPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/address", element: <AddressPage /> },
          { path: "/mypets", element: <MypetsPage /> },
          { path: "/registermypets", element: <RegistermypetsPage /> },
          { path: "/editmypets", element: <EditmypetsPage /> },
          { path: "/pet-profile", element: <PetProfilePage /> },
          { path: "/register-pet/step1", element: <RegisterPetStep1 /> },
          { path: "/register-pet/step2", element: <RegisterPetStep2 /> },
          { path: "/register-pet/step3", element: <RegisterPetStep3 /> },
          { path: "/register-pet/step4", element: <RegisterPetStep4 /> },
          { path: "/register-pet/step5", element: <RegisterPetStep5 /> },
          // {
          //   path: "/live",
          //   element: <LiveHomePage />,
          //   children: [
          //     { path: "host", element: <LiveHostPage /> },
          //     { path: "viewer", element: <LiveViewerPage /> },
          //   ],
          // },
        ],
      },
    ],
  },
  {
    path: "/live",
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <LiveHomePage /> },
      { path: "host", element: <LiveHostPage /> },
      { path: "viewer", element: <LiveViewerPage /> },
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
      {
        path: "register/verification",
        element: <RegisterEmailVerificationPage />,
      },
      {
        path: "callback",
        element: <CallbackPage />,
      },
    ],
  },
]);
