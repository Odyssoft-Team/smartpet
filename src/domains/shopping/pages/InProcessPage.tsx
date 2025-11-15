"use client";

import { useDetailStore } from "@/store/detail";
import { Link } from "react-router-dom";

export default function InProcessPage() {
  const {
    selectedService,
    selectedVariant,
    scheduledDate,
    scheduledTime,
    listAdditionalServices,
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

  if (!hasProgress) {
    return (
      <div className="p-4">
        <h2 className="text-center text-lg">No tienes servicios en progreso</h2>
      </div>
    );
  }

  return (
    <section className="p-4 space-y-4">
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-bold">Servicio en progreso</h2>
        <p>Mascota: {selectedService?.pet_name}</p>
        <p>Variante: {selectedVariant?.name}</p>
        <p>Fecha: {scheduledDate}</p>
        <p>Hora: {scheduledTime}</p>
        <p>Adicionales: {listAdditionalServices.length}</p>
        <p className="font-bold">Total: S/. {selectedService?.total}</p>
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
  );
}
