import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";

export default function RegistermypetsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex items-center mb-4 px-4">
        <Button
          size={"icon"}
          variant={"default"}
          className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer mr-2"
        >
          <IoIosArrowBack />
        </Button>
        <span className="text-lg font-semibold">Mis mascotas</span>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
        {/* Peso y nombre */}
        <div className="relative flex flex-col items-center w-full mb-2">
          <div className="absolute left-0 top-0 bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-bold">
            12 KG
          </div>
          <div className="w-40 h-40 rounded-full border-8 border-blue-200 flex items-center justify-center mb-2 mt-4">
            <span className="text-3xl font-bold text-blue-500">Fidel</span>
          </div>
          {/* Iconos */}
            <div className="flex justify-center gap-4 mb-2">
            <button
              type="button"
              className="flex flex-col items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Perro"
            >
              <span className="text-2xl">🐶</span>
              <span className="text-xs mt-1 text-gray-600">Perro</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Gato"
            >
              <span className="text-2xl">🐱</span>
              <span className="text-xs mt-1 text-gray-600">Gato</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Otro"
            >
              <span className="text-2xl">🐾</span>
              <span className="text-xs mt-1 text-gray-600">Otro</span>
            </button>
            </div>
        </div>
        {/* Foto */}
        <img
          src="https://randomuser.me/api/portraits/men/5.jpg"
          alt="Fidel"
          className="w-40 h-40 rounded-xl object-cover mb-2"
        />
        <span className="text-xs text-gray-500 mb-4">
          Toca para cambiar la foto de perfil
        </span>
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
        <div className="w-full mb-4">
          <label className="block text-sm font-semibold mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            defaultValue="2022-08-16"
          />
        </div>
        {/* Botón Guardar */}
        <Button className="w-full bg-black text-white py-2 rounded-lg font-semibold">
          Guardar
        </Button>
      </div>
    </div>
  );
}
