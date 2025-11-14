import { useParams, useNavigate, Link } from "react-router-dom";
import { FaChevronLeft, FaRegClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import map_img from "@/assets/activities/map-example.png";
import { useDetailStore } from "@/store/detail";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusTranslations: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado", 
  en_route: "En camino",
  in_progress: "En progreso",
  completed: "Completado",
  cancelled: "Cancelado"
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  en_route: "bg-orange-500", 
  in_progress: "bg-green-500",
  completed: "bg-green-700",
  cancelled: "bg-red-500"
};

export default function ActivitiesPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = useDetailStore();

  // Datos mock para que funcione la UI
  const mockServiceOrder = {
    id: orderId,
    status: "en_route",
    total: 45.50,
    scheduled_date: "2024-01-15",
    scheduled_time: "14:30:00",
    updated_at: new Date().toISOString()
  };

  if (!orderId) {
    navigate("/");
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft onClick={() => navigate("/")} className="cursor-pointer" />
          Actividades
        </h2>
      </div>

      <div className="w-full border rounded-md px-2 py-3 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarImage
              src={selectedPet?.photo_url || ""}
              alt={selectedPet?.name || "Mascota"}
            />
            <AvatarFallback>
              {selectedPet?.name?.charAt(0).toUpperCase() || "M"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold flex items-center gap-4 text-lg leading-[1]">
              {selectedPet?.name || "Mascota"}
              <span className="flex items-center gap-1 text-xs font-normal text-[#0085D8]">
                <FaRegClock /> 
                {format(new Date(mockServiceOrder.updated_at), "PPp", { locale: es })}
              </span>
            </h3>
            <p className="font-normal text-xs leading-[1] text-black/50">
              Servicio - {statusTranslations[mockServiceOrder.status]}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={`px-2 py-1 rounded-full text-white text-xs ${statusColors[mockServiceOrder.status]}`}
              >
                {statusTranslations[mockServiceOrder.status]}
              </span>
              <span className="text-xs text-gray-500">
                Total: S/ {mockServiceOrder.total}
              </span>
            </div>
          </div>
        </div>
        
        <figure className="rounded-md overflow-hidden shadow-md">
          <img src={map_img} alt="map" />
        </figure>

        <div className="flex flex-col gap-6 relative">
          {/* Inicio del trayecto */}
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-6 h-6 rounded-full z-[5] ${
                mockServiceOrder.status === 'en_route' || mockServiceOrder.status === 'in_progress' || mockServiceOrder.status === 'completed' 
                  ? 'bg-blue-600' : 'bg-blue-200'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Inicio del trayecto</span>
                <span className="text-blue-500 text-xs">
                  {format(new Date(`${mockServiceOrder.scheduled_date}T${mockServiceOrder.scheduled_time}`), "HH:mm")}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                {mockServiceOrder.status === 'pending' || mockServiceOrder.status === 'confirmed' 
                  ? 'Esperando confirmación' 
                  : 'El servicio se encuentra en camino'}
              </div>
            </div>
          </div>

          <div className={`w-1 h-[60%] absolute left-2.5 top-5.5 z-[2] ${
            mockServiceOrder.status === 'completed' ? 'bg-blue-600' : 'bg-blue-100'
          }`}></div>
          
          {/* Fin del trayecto */}
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-6 h-6 rounded-full z-[5] ${
                mockServiceOrder.status === 'completed' ? 'bg-blue-600' : 'bg-blue-200'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Fin del servicio</span>
                <span className="text-blue-500 text-xs">
                  {mockServiceOrder.status === 'completed' ? 'Completado' : 'Pendiente'}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                {mockServiceOrder.status === 'completed' 
                  ? 'El servicio ha sido completado' 
                  : 'Esperando finalización del servicio'}
              </div>
            </div>
          </div>
        </div>

        <Link to={`/chat/${orderId}`}>
          <Button className="w-full">
            Iniciar Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}
