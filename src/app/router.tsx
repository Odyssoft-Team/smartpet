import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import AppLayout from "./layouts/AppLayout";
import MypetsPage from "@/domains/mypets/pages/MypetsPage";
import AddressPage from "@/domains/address/pages/AddressPage";
import AddressRegisterPage from "@/domains/address/pages/RegisterPage";
import AddressEditPage from "@/domains/address/pages/EditPage";
import CardsPage from "@/domains/cards/pages/CardsPage";
import CardsRegisterPage from "@/domains/cards/pages/RegisterPage";
import GroomingOptionalPage from "@/domains/services/pages/GroomingOptionalPage";

const RegisterPetStep1 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep1")
);
const RegisterPetStep2 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep2")
);
const RegisterPetStep3 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep3")
);
const RegisterPetStep4 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep4")
);
const RegisterPetStep5 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep5")
);
const RegisterPetStep6 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep6")
);
const RegisterPetStep7 = lazy(
  () => import("@/domains/mypets/pages/RegisterPetStep7")
);

const HomePage = lazy(() => import("../domains/home/pages/HomePage"));
const ServicesPage = lazy(
  () => import("../domains/services/pages/ServicesPage")
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
const InProcessPage = lazy(
  () => import("../domains/shopping/pages/InProcessPage")
);
const NotificationsPage = lazy(
  () => import("../domains/notifications/pages/NotificationsPage")
);
const ActivitiesPage = lazy(
  () => import("../domains/activities/pages/ActivitiesPage")
);
const ChatPage = lazy(() => import("../domains/activities/pages/ChatPage"));
const VideoCallPage = lazy(
  () => import("../domains/activities/pages/VideoCallPage")
);
const RatingPage = lazy(() => import("../domains/activities/pages/RatingPage"));
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
const PetProfilePage = lazy(
  () => import("../domains/mypets/pages/PetProfilePage")
);
const PetMedicalProfilePage = lazy(
  () => import("../domains/mypets/pages/PetMedicalProfilePage")
);
const MyMedicalPetsPage = lazy(
  () => import("../domains/mypets/pages/MyMedicalPetsPage")
);
const VaccineListPage = lazy(
  () => import("../domains/mypets/pages/VaccineListPage")
);
const VaccineFormPage = lazy(
  () => import("../domains/mypets/pages/VaccineFormPage")
);
const DewormingListPage = lazy(
  () => import("../domains/mypets/pages/DewormingListPage")
);
const DewormingFormPage = lazy(
  () => import("../domains/mypets/pages/DewormingFormPage")
);
const RevisionsListPage = lazy(
  () => import("../domains/mypets/pages/RevisionsListPage")
);
const RevisionsFormPage = lazy(
  () => import("../domains/mypets/pages/RevisionsFormPage")
);

const CallbackPage = lazy(() => import("@/domains/auth/pages/CallbackPage"));

// ------------------ LIVE STREAM ------------------
const LiveHomePage = lazy(() => import("@/domains/live/pages/HomePage"));
const LiveHostPage = lazy(() => import("@/domains/live/pages/HostPage"));
const LiveViewerPage = lazy(() => import("@/domains/live/pages/ViewerPage"));

const RescheduleServicePage = lazy(() => import("../domains/services/pages/RescheduleServicePage"));

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
          { path: "/services/grooming", element: <GroomingServicesPage /> },
          { path: "/services/grooming", element: <GroomingServicesPage /> },
          { path: "/services/grooming/optional", element: <GroomingOptionalPage /> },
          { path: "/services/grooming/3", element: <GroomingCalendarPage /> },
          { path: "/shopping", element: <ShoppingPage /> },
          { path: "/shopping/in-process", element: <InProcessPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/activities/:orderId", element: <ActivitiesPage /> },
          { path: "/activities/:orderId/reschedule", element: <RescheduleServicePage /> },
          { path: "/chat/:orderId", element: <ChatPage /> },
          { path: "/video/:orderId", element: <VideoCallPage /> },
          { path: "/rating/:orderId", element: <RatingPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/address", element: <AddressPage /> },
          { path: "/address/register", element: <AddressRegisterPage /> },
          { path: "/address/edit/:id", element: <AddressEditPage /> },
          { path: "/cards", element: <CardsPage /> },
          { path: "/cards/add", element: <CardsRegisterPage /> },
          { path: "/mypets", element: <MypetsPage /> },
          { path: "/mypets-medical", element: <MyMedicalPetsPage /> },
          { path: "/editmypets", element: <EditmypetsPage /> },
          { path: "/pet-profile", element: <PetProfilePage /> },
          { path: "/pet-medical-profile", element: <PetMedicalProfilePage /> },
          { path: "/pets/:petId/vaccines", element: <VaccineListPage /> },
          { path: "/pets/:petId/vaccines/new", element: <VaccineFormPage /> },
          { path: "/pets/:petId/deworming", element: <DewormingListPage /> },
          {
            path: "/pets/:petId/deworming/new",
            element: <DewormingFormPage />,
          },
          { path: "/pets/:petId/revisions", element: <RevisionsListPage /> },
          {
            path: "/pets/:petId/revisions/new",
            element: <RevisionsFormPage />,
          },
          { path: "/register-pet/step1", element: <RegisterPetStep1 /> },
          { path: "/register-pet/step2", element: <RegisterPetStep2 /> },
          { path: "/register-pet/step3", element: <RegisterPetStep3 /> },
          { path: "/register-pet/step4", element: <RegisterPetStep4 /> },
          { path: "/register-pet/step5", element: <RegisterPetStep5 /> },
          { path: "/register-pet/step6", element: <RegisterPetStep6 /> },
          { path: "/register-pet/step7", element: <RegisterPetStep7 /> },
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
