import { Button } from "@/components/ui/button";
import fidel_pet from "@/assets/pets/fidel-dog.png";
import trufa_cat from "@/assets/pets/trufa-cat.png";
import olivia_dog from "@/assets/pets/olivia-dog.png";
import { TbDog } from "react-icons/tb";
import { Cat } from "lucide-react";
import { Link } from "react-router-dom";

export default function MypetsPage() {
  return (
    <div className="h-full">
      <Button
        size="back"
        variant={"back"}
        className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
      >
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
            // src="https://randomuser.me/api/portraits/men/1.jpg"
            src={fidel_pet}
            alt="Mascota 1"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <div className="flex gap-x-1 items-center">
              <span className="text-base text-black">Fidel</span>
              <TbDog />
            </div>
            <span className="text-xs text-gray-500">Edad: 2 años</span>
          </div>

          <Link to="/perfil-fidel">
            <Button size="sm" variant="primary" className="px-6 font-light">
              Editar
            </Button>
          </Link>
        </div>
        {/* Mascota 2 */}
        <div className="flex gap-4 items-center py-2 border-b">
          <img
            // src="https://randomuser.me/api/portraits/women/2.jpg"
            src={trufa_cat}
            alt="Mascota 2"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <div className="flex items-center gap-x-1">
              <span className="text-base text-black">Trufa</span>
              <Cat className="size-[15px]" />
            </div>
            <span className="text-xs text-gray-500">Edad: 4 años</span>
          </div>
          <Link to="/perfil-trufa">
            <Button size="sm" variant="primary" className="px-6 font-light">
              Editar
            </Button>
          </Link>
        </div>
        {/* Mascota 3 */}
        <div className="flex gap-4 items-center py-2 border-b">
          <img
            // src="https://randomuser.me/api/portraits/men/3.jpg"
            src={olivia_dog}
            alt="Mascota 3"
            className="w-16 h-16 rounded-full object-cover mx-auto"
          />
          <div className="flex flex-col items-start w-full">
            <div className="flex items-center gap-x-1">
              <span className="text-base text-black">Olivia</span>
              <TbDog />
            </div>
            <span className="text-xs text-gray-500">Edad: 3 años</span>
          </div>
          <Link to="/perfil-olivia">
            <Button size="sm" variant="primary" className="px-6 font-light">
              Editar
            </Button>
          </Link>
        </div>
        {/* Nueva Mascota */}

        <div className="flex gap-1 items-center py-2 rounded-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full object-cover mx-auto bg-gray-200" />
            <Button size="sm" variant="ghost" className="text-gray-400">
              Nueva Mascota
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
