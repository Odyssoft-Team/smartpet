import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceStore } from "@/store/service.store";
import {
  getAvailableDatesByService,
  type AvailableDates,
} from "../services/getAvailableDatesByService";
import { format } from "date-fns";
import { useDetailStore } from "@/store/detail";
import type { Address } from "@/domains/address/pages/AddressPage";
import { supabase } from "@/lib/supabaseClient";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function RescheduleServicePage() {
  const { orderId } = useParams();
  const { selectedService } = useServiceStore();
  const navigate = useNavigate();

  const [availableDates, setAvailableDates] = useState<AvailableDates[]>([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const data = await getAvailableDatesByService(selectedService?.id ?? 1); // Default to service ID 1

        if (data) {
          setAvailableDates(data);
          console.log("✅ Fechas disponibles:", data);
        } else {
          console.log("No se pudo cargar fechas disponibles");
        }
      } catch (error) {
        console.error("Error cargando fechas:", error);
      }
    };

    fetchAvailableDates();
  }, [selectedService]);

  const getInitialDate = () => {
    const today = new Date();
    const day = today.getDay();
    if (day === 0) {
      today.setDate(today.getDate() + 1);
    }
    return today;
  };

  const { selectedDateService, setSelectedDateService } = useDetailStore();

  useEffect(() => {
    setSelectedDateService(getInitialDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [isRescheduled, setIsRescheduled] = useState<boolean>(false);

  const handleReschedule = async () => {
    if (!selectedDateService || isRescheduled) {
      toast.warning("Por favor, selecciona una nueva fecha.");
      return;
    }

    setIsRescheduling(true);

    // Simular el proceso de reprogramación
    const rescheduleData = {
      orderId: orderId,
      newDate: selectedDateService,
      selectedAddress: selectedId,
    };

    // Simular loading de 2 segundos
    setTimeout(() => {
      console.log("📋 SERVICIO REPROGRAMADO:", rescheduleData);
      
      setIsRescheduling(false);
      setIsRescheduled(true);
      
      toast.success("Servicio reprogramado exitosamente");
      
      // Volver a la página de actividades después de 1 segundo
      setTimeout(() => {
        navigate(`/activities/${orderId}`);
      }, 1000);
    }, 2000);
  };

  const isRescheduleDisabled = isRescheduling || !selectedDateService || isRescheduled;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(
    addresses.find((a) => a.is_default)?.id ?? null
  );

  useEffect(() => {
    setSelectedId(addresses.find((a) => a.is_default)?.id ?? null);
  }, [addresses]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) {
        console.error("Error obteniendo direcciones:", error);
      } else {
        setAddresses(data || []);
      }
    } catch (error) {
      console.error("Error en fetchAddresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      {/* Encabezado */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft 
            onClick={() => navigate(`/activities/${orderId}`)} 
            className="cursor-pointer"
          />
          Reprogramar Servicio
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {/* Calendario */}
        <div className="w-full">
          <h2 className="text-xl font-bold">Nueva fecha y horario</h2>
          <div className="w-full flex flex-col gap-4 mt-3">
            <Calendar
              mode="single"
              selected={selectedDateService}
              onSelect={setSelectedDateService}
              defaultMonth={selectedDateService}
              numberOfMonths={1}
              locale={es}
              className="w-full p-2 rounded-2xl !bg-[#f5f5f5]"
              buttonVariant="outline"
              navLayout="after"
              showOutsideDays
              disabled={(day: Date) => {
                const today = new Date();
                const todayLocal = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );
                const dayLocal = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate()
                );

                // Deshabilitar domingos y días pasados
                return dayLocal < todayLocal || dayLocal.getDay() === 0;
              }}
              modifiers={{
                available: (day) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const d = new Date(day);
                  d.setHours(0, 0, 0, 0);
                  return d >= today && d.getDay() !== 0;
                },
              }}
              components={{
                MonthCaption: ({ children }) => (
                  <div className="flex items-center px-4 h-9 py-0 relative">
                    {children}
                  </div>
                ),
                PreviousMonthButton: (props) => (
                  <button
                    {...props}
                    className="absolute top-1/2 right-12 z-20 p-2 rounded-md border hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="size-5 text-[#D86C00]" />
                  </button>
                ),
                NextMonthButton: (props) => (
                  <button
                    {...props}
                    className="absolute top-1/2 right-2 z-20 p-2 rounded-md border hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="size-5 text-[#D86C00]" />
                  </button>
                ),
                CaptionLabel: ({ children }) => (
                  <div className="text-[15px] font-medium capitalize text-sky-600">
                    {children}
                  </div>
                ),
                Weekday: (props) => (
                  <th
                    {...props}
                    className="w-full uppercase text-center text-gray-400 text-sm"
                  />
                ),
                Day: ({ children, ...props }) => (
                  <td
                    {...props}
                    className="flex justify-center items-center gap-[2px] h-15 w-full"
                  >
                    {children}
                  </td>
                ),

                DayButton: (props) => {
                  const { modifiers } = props;
                  const isAvailable = modifiers.available;
                  const isSelected = modifiers.selected;

                  const format_date = format(props.day.date, "yyyy-MM-dd");

                  const temp_date = availableDates.find((item) => {
                    return item.date === format_date;
                  });

                  const capacity =
                    (temp_date?.max_capacity as number) -
                    (temp_date?.used_capacity as number);

                  const isFull = capacity === 0;
                  return (
                    <button
                      {...props}
                      disabled={capacity === 0}
                      className={cn(
                        "text-sm transition-all flex flex-col w-10 h-15 border rounded-md bg-white justify-center items-center gap-1",
                        isSelected
                          ? "bg-[#0085D8] text-white shadow-md scale-105"
                          : isAvailable && !isFull
                            ? "text-black"
                            : "text-gray-400 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="font-bold text-xs">
                        {props.children}
                      </span>
                      <span className="size-5 rounded-full bg-[#D86c00] text-white text-xs flex items-center justify-center">
                        {isAvailable ? capacity : "0"}
                      </span>
                    </button>
                  );
                },
              }}
            />
          </div>
        </div>

        {/* Botón Reprogramar */}
        <Button
          onClick={handleReschedule}
          disabled={isRescheduleDisabled}
          className={cn(
            "w-full transition-all duration-300",
            isRescheduled
              ? "bg-[#2EA937] hover:bg-[#2EA937] text-white"
              : "bg-[#D86C00] hover:bg-[#D86C00] text-white"
          )}
        >
          {isRescheduling ? (
            "Reprogramando..."
          ) : isRescheduled ? (
            <span className="flex items-center gap-x-2">
              Reprogramado <FaCheck />
            </span>
          ) : (
            "Confirmar Nueva Fecha"
          )}
        </Button>

        <hr className="w-full mt-2 bg-gray-600" />

        {/* Sección de ubicación */}
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-xl font-bold">Dirección de servicio</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando direcciones...
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">No tienes direcciones registradas</p>
              <Link to="/address/register">
                <Button className="bg-black text-white">
                  Agregar dirección
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-gray-200 rounded-lg p-2 space-y-3 flex items-center justify-between"
                >
                  <div className="flex flex-col m-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{address.alias}</h3>
                      {address.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {address.address}
                    </p>
                  </div>

                  <div className="flex">
                    <Checkbox
                      checked={selectedId === address.id}
                      onCheckedChange={() => handleSelect(address.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}