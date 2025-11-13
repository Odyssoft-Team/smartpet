import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import RegisterPetStep1 from "./domains/mypets/pages/RegisterPetStep1";
import RegisterPetStep2 from "./domains/mypets/pages/RegisterPetStep2";
import RegisterPetStep3 from "./domains/mypets/pages/RegisterPetStep3";
import RegisterPetStep4 from "./domains/mypets/pages/RegisterPetStep7";
import RegisterPetStep5 from "./domains/mypets/pages/RegisterPetStep7";

// ...existing routes...

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ...existing routes...
      {
        path: "register-pet/step1",
        element: <RegisterPetStep1 />,
      },
      {
        path: "register-pet/step2",
        element: <RegisterPetStep2 />,
      },
      {
        path: "register-pet/step3",
        element: <RegisterPetStep3 />,
      },
      {
        path: "register-pet/step4",
        element: <RegisterPetStep4 />,
      },
      {
        path: "register-pet/step5",
        element: <RegisterPetStep5 />,
      },
      // ...existing routes...
    ],
  },
]);
