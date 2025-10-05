import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";

export default function MypetsPage() {
  return (
    <div className="h-full">
      <Button
        size="back"
        variant={"back"}
        className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
      ><IoIosArrowBack />
        Mis mascotas
      </Button>
      <div className="mt-6 w-full max-w-md mx-auto">
        <div className=" grid-cols-3 gap-4 items-center mb-2 font-semibold text-gray-700 hidden">
          <div>Foto</div>
          <div>Nombre</div>
          <div>Editar</div>
        </div>
        {/* Mascota 1 */}
        <div className="flex gap-4 items-center py-2 border-b">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Mascota 1"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-black">Firulais</span>
            <span className="text-xs text-gray-500">Edad: 2 años</span>
          </div>
          
          <Button size="sm" variant="primary" className="w-20">
            Editar
          </Button>
        </div>
        {/* Mascota 2 */}
        <div className="flex gap-4 items-center py-2 border-b">
          <img
            src="https://randomuser.me/api/portraits/women/2.jpg"
            alt="Mascota 2"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-black">Firulais</span>
            <span className="text-xs text-gray-500">Edad: 2 años</span>
          </div>
          <Button size="sm" variant="primary">
            Editar
          </Button>
        </div>
        {/* Mascota 3 */}
        <div className="flex gap-4 items-center py-2 border-b">
          <img
            src="https://randomuser.me/api/portraits/men/3.jpg"
            alt="Mascota 3"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-black">Firulais</span>
            <span className="text-xs text-gray-500">Edad: 2 años</span>
          </div>
          <Button size="sm" variant="primary">
            Editar
          </Button>
        </div>
        {/* Nueva Mascota */}

        <div className="flex gap-3 items-center justify-start py-2 rounded-lg">
          <img
            src="https://randomuser.me/api/portraits/men/3.jpg"
            alt="Mascota 3"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          
          <Button size="sm" variant="ghost">
            Nueva Mascota
          </Button>
        </div>
      </div>
    </div>
  );
}
