import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Cat } from "lucide-react";
import { TbDog } from "react-icons/tb";
import { Link } from "react-router-dom";
import fidel_pet from "@/assets/pets/fidel-cuadrado.png";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Perfil3() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(2022, 7, 16)); // 2022-08-16

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false); // Cerrar el popover después de seleccionar
  };

  // Formatear la fecha para el input type="date" (YYYY-MM-DD)
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Formatear la fecha para mostrar (dd/MM/yyyy)

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white h-fit">
      <div className="w-full flex justify-start">
        <Link to="/mypets" className="!text-black">
          <Button
            size="back"
            variant={"back"}
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Mis mascotas</span>
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
            <span className="text-3xl font-bold text-blue-500">Olivia</span>
            {/* botones */}
            <div className="rounded-full flex gap-x-6 border border-neutral-200 bg-gray-100 py-1 px-2 mb-2 mt-1">
              <button>
                <Cat className="size-5 text-gray-500" />
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
            <div className="flex justify-between items-center">
              <span>Fecha de nacimiento</span>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button type="button">
                    <FaRegCalendarAlt size={18} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="h-16 flex items-start px-4 py-3">
            <input
              type="date"
              value={formatDateForInput(date)}
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : undefined;
                setDate(newDate);
              }}
              className="w-full border rounded px-1 text-sky-500 font-semibold text-sm"
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
