import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
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
  // 🗓️ Estados locales
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<"AM" | "PM" | null>(null);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);

  // 📍 Información de dirección y coordenadas
  const [addressLabel] = useState("Casa Principal");
  const [address] = useState("Av. Las Camelias 123, Lima");
  const [coordinates, setCoordinates] = useState({
    lat: -12.046374,
    lng: -77.042793,
  });

  const customIcon = createCustomIcon();

  // 📍 Manejador del clic en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    console.log("Coordenadas guardadas:", { lat, lng });
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      {/* Encabezado */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Horarios disponibles
        </h2>

        <Button className="flex w-fit" disabled>
          Continuar
        </Button>
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
              disabled={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const d = new Date(day);
                d.setHours(0, 0, 0, 0);
                return d < today || d.getDay() === 0;
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
                  <div
                    {...props}
                    className="w-full uppercase text-center text-gray-400 text-sm"
                  />
                ),
                Day: ({ children, ...props }) => (
                  <div
                    {...props}
                    className="w-full flex justify-center items-center gap-[2px] h-8"
                  >
                    {children}
                  </div>
                ),
                DayButton: (props) => {
                  const { modifiers } = props;
                  const isAvailable = modifiers.available;
                  const isSelected = modifiers.selected;

                  return (
                    <button
                      {...props}
                      className={cn(
                        "size-8 rounded-full text-sm transition-all",
                        isSelected
                          ? "bg-[#D86C00] text-white shadow-md scale-105"
                          : isAvailable
                            ? "text-[#D86C00] hover:bg-[#ffe7cc]"
                            : "text-gray-400 opacity-50"
                      )}
                    />
                  );
                },
              }}
            />

            {/* Botones AM / PM */}
            <div className="w-full flex items-start justify-between">
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-2xl">
                <Button
                  onClick={() => setPeriod("AM")}
                  className={cn(
                    "h-11 rounded-2xl",
                    period === "AM"
                      ? "bg-[#2EA937] text-white border-[#2EA937]"
                      : "bg-transparent text-black"
                  )}
                >
                  AM
                </Button>
                <Button
                  onClick={() => setPeriod("PM")}
                  className={cn(
                    "h-11 rounded-2xl",
                    period === "PM"
                      ? "bg-[#2EA937] text-white border-[#2EA937]"
                      : "bg-transparent text-black"
                  )}
                >
                  PM
                </Button>
              </div>

              {/* Horarios disponibles */}
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
            </div>
          </div>
        </div>

        <Button>Reservar</Button>

        <hr className="w-full mt-6 bg-gray-600" />

        {/* 📍 Sección de ubicación */}
        <div className="w-full">
          <h2 className="text-xl font-bold">Ubicación</h2>

          <div className="w-full flex items-center justify-between mt-4">
            <div>
              <div className="flex items-center gap-x-2 text-base font-bold">
                {addressLabel} <FaMapMarkerAlt className="size-4 text-black" />
              </div>
              <p className="text-sm text-gray-500">{address}</p>
            </div>
            <button
              onClick={() => setIsMapOpen(!isMapOpen)}
              className="size-5 flex items-center justify-center rounded-full bg-gray-200"
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
