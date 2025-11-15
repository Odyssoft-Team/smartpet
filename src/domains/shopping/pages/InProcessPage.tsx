"use client";

import { Separator } from "@/components/ui/separator";
import { useDetailStore } from "@/store/detail";
import { format } from "date-fns";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function InProcessPage() {
  const {
    selectedPet,
    selectedService,
    selectedVariant,
    selectedDateService,
    listAdditionalServices,
    totalAdditionalServices,
    lastStep,
    reset,
  } = useDetailStore();

  const hasProgress = !!selectedService;

  const handleContinue = () => {
    switch (lastStep) {
      case "variant":
        return "/services/grooming/2"; // ⬅ pon tu ruta real
      case "calendar":
        return "/services/grooming/3"; // ⬅ pon tu ruta real
      case "payment":
        return "/shopping"; // ⬅ pon tu ruta real
      default:
        return "/";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center overflow-hidden">
      {/* Encabezado */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Mis servicios pendientes
        </h2>
      </div>
      {hasProgress ? (
        <section className="p-4 space-y-4 w-full">
          <div className="bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl">
            <h2 className="text-lg font-bold w-full flex items-center justify-between">
              Grooming{" "}
              <span className="text-sm">S/. {selectedService?.total}</span>
            </h2>
            <p>Mascota: {selectedPet?.name}</p>
            <p>Variante: {selectedVariant?.name}</p>
            <p>Fecha: {format(selectedDateService as Date, "dd/MM/yyyy")}</p>
            <p>Adicionales ({listAdditionalServices.length}): </p>
            {listAdditionalServices.length > 0 && (
              <ul className="text-sm pl-5 list-disc">
                {listAdditionalServices.map((service) => (
                  <li key={service.id} className="">
                    {service.name} - S/. {service.price}
                  </li>
                ))}
              </ul>
            )}
            <Separator className="my-3" />
            <p className="font-bold w-full text-end text-green-500">
              Total: S/. {selectedService?.total + totalAdditionalServices}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              Eliminar
            </button>

            <Link to={handleContinue()}>
              <button className="px-4 py-2 rounded bg-blue-600 text-white">
                Continuar
              </button>
            </Link>
          </div>
        </section>
      ) : (
        <div className="p-4">
          <h2 className="text-center text-base">
            No tienes servicios en progreso
          </h2>
        </div>
      )}
    </div>
  );
}
