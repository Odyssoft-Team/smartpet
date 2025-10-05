import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";


export default function ServicesPage() {
  return (
    <div className="h-full">

      <div className="flex flex-col gap-4 h-full justify-center items-center">
        <h1>Allqupet</h1>
        
        <div className="justify-between flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-4">
            <h2>Crear una cuenta</h2>
            <p>Introduce tu correo electrónico para registrarte en esta aplicación</p>
            <Input />
            <Button
              size={"icon"}
              variant={"default"}
              className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer"
            //onClick={() => setOpenBusiness(!openBusiness)}
            >
              Registro
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              size={"icon"}
              variant={"default"}
              className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer"
            //onClick={() => setOpenBusiness(!openBusiness)}
            >
              <FcGoogle />
              Continuar con Google
            </Button>
            <Button
              size={"icon"}
              variant={"default"}
              className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer"
            //onClick={() => setOpenBusiness(!openBusiness)}
            >
              <FaFacebook />
              Continuar con Facebook
            </Button>
            <Button
              size={"icon"}
              variant={"default"}
              className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer"
            //onClick={() => setOpenBusiness(!openBusiness)}
            >
              <FaApple />

              Continuar con Apple
            </Button>
          </div>
        </div>
      </div>
      <p>Al hacer clic en continuar, aceptas nuestros Términos de Servicio y nuestra Política de Privacidad</p>

    </div>
  );
}