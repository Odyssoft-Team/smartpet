import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";


export default function ServicesPage() {
  return (
    <div>

      <div className="flex flex-col gap-4">
        <h1>Registro</h1>
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
      <p>Al hacer clic en continuar, aceptas nuestros Términos de Servicio y nuestra Política de Privacidad</p>

    </div>
  );
}