import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";

import { MapContainer } from "react-leaflet/MapContainer";
import { useMapEvents } from "react-leaflet";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useProfileStore } from "@/store/profile.store";
import { Link } from "react-router-dom";
import { useServiceStore } from "@/store/service.store";
import {
  getAvailableDatesByService,
  type AvailableDates,
} from "../services/getAvailableDatesByService";
import { format } from "date-fns";

function MapEvents({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

const createCustomIcon = () => {
  const iconMarkup = renderToStaticMarkup(
    <FaMapMarkerAlt className="text-[#D86C00] text-2xl" />
  );

  return divIcon({
    html: iconMarkup,
    iconSize: [32, 32],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: "custom-marker-icon",
  });
};

export default function GroomingCalendarPage() {
  const { selectedService } = useServiceStore();

  const [availableDates, setAvailableDates] = useState<AvailableDates[]>([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const data = await getAvailableDatesByService(selectedService?.id ?? 0);

        if (data) {
          setAvailableDates(data);

          console.log("✅ Fechas:", data);
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

  // 🗓️ Estados locales
  const [date, setDate] = useState<Date | undefined>(getInitialDate());
  // const [period, setPeriod] = useState<"AM" | "PM" | null>(null);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [isReserved, setIsReserved] = useState<boolean>(false);

  // 📍 Información de dirección y coordenadas
  const { profile } = useProfileStore();

  const [coordinates, setCoordinates] = useState({
    lat: -12.046374,
    lng: -77.042793,
  });

  const customIcon = createCustomIcon();

  // 📍 Manejador del clic en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  // 🎯 Función para manejar la reserva
  const handleReserve = async () => {
    if (!date || isReserved) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setIsReserving(true);

    // Crear objeto con toda la información
    const reservationData = {
      date: date,
      // period: period,
      address: {
        label: profile.label_address,
        fullAddress: profile.address,
        coordinates: coordinates,
      },
    };

    // Simular loading de 2 segundos
    setTimeout(() => {
      console.log("📋 DATOS DE RESERVA GUARDADOS:", reservationData);

      setIsReserving(false);
      setIsReserved(true); // ✅ Esta línea se mantiene permanentemente
    }, 2000);
  };

  // Habilitar botón Continuar solo si hay reserva exitosa
  const isContinueEnabled = isReserved;

  // Deshabilitar botón Reservar si ya está reservado
  const isReserveDisabled = isReserving || !date || isReserved;

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      {/* Encabezado */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Horarios disponibles
        </h2>

        <Link to={"/shopping"}>
          <Button className="flex w-fit" disabled={!isContinueEnabled}>
            Continuar
          </Button>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {/* Calendario */}
        <div className="w-full">
          <h2 className="text-xl font-bold">Fecha y horario</h2>
          <div className="w-full flex flex-col gap-4 mt-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
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

                  return (
                    <button
                      {...props}
                      className={cn(
                        "text-sm transition-all flex flex-col w-10 h-15 border rounded-md bg-white justify-center items-center gap-1 text-black",
                        isSelected
                          ? "bg-[#0085D8] text-white shadow-md scale-105"
                          : isAvailable
                            ? " "
                            : "text-gray-400 opacity-50"
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
            {/* Botones AM / PM */}
            {/* <div className="w-full flex items-start justify-between">
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-2xl">
                <Button
                  onClick={() => setPeriod("AM")}
                  className={cn(
                    "h-11 rounded-2xl ",
                    period === "AM"
                      ? "bg-[#2EA937] text-white border-[#2EA937] hover:bg-[#2EA937]"
                      : "bg-transparent hover:bg-transparent text-black"
                  )}
                >
                  AM
                </Button>
                <Button
                  onClick={() => setPeriod("PM")}
                  className={cn(
                    "h-11 rounded-2xl ",
                    period === "PM"
                      ? "bg-[#2EA937] text-white border-[#2EA937] hover:bg-[#2EA937]"
                      : "bg-transparent hover:bg-transparent text-black"
                  )}
                >
                  PM
                </Button>
              </div>

              <div className="rounded-md flex items-center justify-center flex-col text-center gap-2 p-4 bg-[#f5f5f5]">
                <h3 className="text-[#0085D8] text-sm font-semibold">
                  Horarios disponibles
                </h3>
                {period ? (
                  <span className="text-4xl font-bold text-[#D86C00]">6</span>
                ) : (
                  <p className="text-black/50 text-xs max-w-[20ch]">
                    Seleccione AM o PM para revisar los horarios
                  </p>
                )}
              </div>
            </div> */}
          </div>
        </div>

        {/* Botón Reservar */}
        <Button
          onClick={handleReserve}
          disabled={isReserveDisabled}
          className={cn(
            "w-full transition-all duration-300",
            isReserved
              ? "bg-[#2EA937] hover:bg-[#2EA937] text-white"
              : "bg-[#D86C00] hover:bg-[#D86C00] text-white"
          )}
        >
          {isReserving ? (
            "Reservando..."
          ) : isReserved ? (
            <span className="flex items-center gap-x-2">
              Reservado <FaCheck />{" "}
            </span>
          ) : (
            "Reservar"
          )}
        </Button>

        <hr className="w-full mt-6 bg-gray-600" />

        {/* 📍 Sección de ubicación */}
        <div className="w-full">
          <h2 className="text-xl font-bold">Ubicación</h2>

          <div className="w-full flex items-center justify-between mt-4">
            <div>
              <div className="flex items-center gap-x-2 text-base font-bold">
                {profile.label_address}{" "}
                <FaMapMarkerAlt className="size-4 text-black" />
              </div>
              <p className="text-sm text-gray-500">{profile.address}</p>
            </div>
            <button
              onClick={() => !isReserved && setIsMapOpen(!isMapOpen)}
              disabled={isReserved}
              className={cn(
                "size-5 flex items-center justify-center rounded-full bg-gray-200",
                isReserved && "opacity-50 cursor-not-allowed"
              )}
            >
              <IoIosArrowDown
                className={cn(
                  "size-4 text-black transition-transform",
                  isMapOpen ? "rotate-0" : "rotate-180"
                )}
                strokeWidth={12}
              />
            </button>
          </div>

          <div className="w-full h-[1px] mt-2 bg-gray-300" />

          {/* 🗺️ Contenedor del mapa */}
          <div
            className={cn(
              "w-full overflow-hidden rounded-xl mt-3 relative z-0 transition-all duration-300 ease-in-out",
              isMapOpen ? "h-[200px]" : "h-0"
            )}
          >
            <MapContainer
              className="w-full h-full relative z-0"
              center={[coordinates.lat, coordinates.lng]}
              zoom={18}
              scrollWheelZoom={true}
              style={{ position: "relative", zIndex: 0 }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapEvents onMapClick={handleMapClick} />

              <Marker
                position={[coordinates.lat, coordinates.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-center">
                    <strong>Tu ubicación seleccionada</strong>
                    <br />
                    Lat: {coordinates.lat.toFixed(6)}
                    <br />
                    Lng: {coordinates.lng.toFixed(6)}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium">Coordenadas guardadas:</span>
                <span className="text-gray-600">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
