import fidel_circle from "@/assets/home/fidel-circle.png";
import { FaChevronLeft, FaRegClock } from "react-icons/fa";
import map_img from "@/assets/activities/map-example.png";

export default function ActivitiesPage() {
  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Actividades
        </h2>
      </div>

      <div className="w-full border rounded-md px-2 py-3 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <figure className="relative flex">
            <img
              className="size-8 rounded-full overflow-hidden object-cover"
              src={fidel_circle}
              alt="asds"
            />
          </figure>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold flex items-center gap-4 text-lg leading-[1]">
              Fidel{" "}
              <span className="flex items-center gap-1 text-xs font-normal text-[#0085D8]">
                <FaRegClock /> Hace 3 minutos
              </span>
            </h3>
            <p className="font-normal text-xs leading-[1] text-black/50">
              Tu servicio esta en camino
            </p>
          </div>
        </div>
        <figure className="rounded-md overflow-hidden shadow-md">
          <img src={map_img} alt="map" />
        </figure>

        <div className="flex flex-col gap-6 relative">
          {/* Inicio del trayecto */}
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 z-[5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Inicio el trayecto</span>
                <span className="text-blue-500 text-xs">9:42</span>
              </div>
              <div className="text-gray-500 text-sm">
                El camión se encuentra en camino
              </div>
            </div>
          </div>

          <div className="w-1 h-[60%] bg-blue-100 absolute left-2.5 top-5.5 z-[2]"></div>
          {/* Fin del trayecto */}
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <div className="w-6 h-6 rounded-full bg-blue-200 z-[5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Fin del trayecto</span>
                <span className="text-blue-500 text-xs">9:52</span>
              </div>
              <div className="text-gray-500 text-sm">
                El camión ha llegado a destino
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
