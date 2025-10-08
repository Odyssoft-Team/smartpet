import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Cat } from "lucide-react";
import { TbDog } from "react-icons/tb";
import { Link } from "react-router-dom";
import fidel_pet from "@/assets/pets/fidel-cuadrado.png";
// import { useState } from "react";

export default function Perfil1() {
  // const [createPet, setCreatePet] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start">
        <Link to="/mypets" className="">
          <Button
            size="back"
            variant={"back"}
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack />
            Mis mascotas
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-xl p-4 flex flex-col items-center">
        {/* Peso y nombre */}
        <div className="relative flex flex-col justify-end w-full h-[300px] mb-2">
          <span className="absolute -top-3 left-0 text-2xl font-bold">...</span>
          <div className="absolute left-14 top-5 size-14 flex justify-center items-center bg-[#409BFD] text-black rounded-full text-sm font-bold z-[15]">
            12 KG
          </div>
          <div className="size-64 rounded-full border-[25px] border-blue-200 flex items-center justify-center mb-2 mt-4 absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
          <div className="flex flex-col items-center z-20">
            <span className="text-3xl font-bold text-blue-500">Fidel</span>
            {/* botones */}
            <div className="rounded-full flex gap-x-6 border border-neutral-200 bg-gray-100 py-1 px-2 mb-2 mt-1">
              <button>
                <Cat className="size-5" />
              </button>
              <button>
                <TbDog className="size-5" />
              </button>
            </div>
            <img
              src={fidel_pet}
              alt="Fidel"
              className="size-[160px] rounded-xl object-cover z-20"
            />
            <span className="text-[10px] text-gray-500">
              Toca para cambiar la foto de perfil
            </span>
          </div>
        </div>
        {/* Foto */}
        {/* Raza */}
        <div className="w-full mb-2">
          <label className="block text-sm font-semibold mb-1">Raza</label>
          <select className="w-full border rounded px-3 py-2 text-orange-600 font-semibold">
            <option>Dachshund</option>
            <option>Pug</option>
            <option>Golden Retriever</option>
            <option>Beagle</option>
            <option>Chihuahua</option>
          </select>
          <span className="text-xs text-gray-400">
            Despliega la lista de razas
          </span>
        </div>
        {/* Fecha de nacimiento */}
        <div className="w-full rounded-lg mb-4 bg-[#F3F3F3]">
          <div className="flex flex-col gap-y-1 text-sm font-semibold mb-1 px-4 py-2">
            <span className="text-neutral-500 text-[11px]">
              Seleccione una fecha (dd/mm/yyyy)
            </span>
            <div>Fecha de nacimiento</div>
          </div>
          <hr className="mt-4" />
          <div className="h-16 flex items-start px-4 py-3">
            <input
              type="date"
              className="w-full border rounded px-1 text-blue-500 font-semibold"
              defaultValue="2022-08-16"
            />
          </div>
        </div>
        {/* Botón Guardar */}
        <Button className="bg-black text-white rounded-lg font-light px-6">
          Guardar
        </Button>
      </div>
    </div>
  );
}
