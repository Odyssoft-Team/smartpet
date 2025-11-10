import { FaChevronLeft } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CiClock2 } from "react-icons/ci";
import { PiDogFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "@/store/service.store";
import { TYPE_SERVICE_GROMMING } from "@/domains/home/utils/Services";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useServices } from "@/domains/home/services/useServices";
import { toast } from "sonner";
import { useDetailStore, type ServiceVariant } from "@/store/detail";

export default function GroomingServicesPage() {
  const navigate = useNavigate();

  const { selectedService } = useServiceStore();
  const { getServiceVariants } = useServices();
  const { setVariant } = useDetailStore();

  const [variants, setVariants] = useState<ServiceVariant[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      if (variants.length > 0) {
        console.log("✅ Ya hay datos, omitiendo fetch");
        return;
      }
      try {
        const data = await getServiceVariants(selectedService?.id ?? 0);

        if (data) {
          setVariants(data);
          console.log("✅ Servicios cargados:", data);
        } else {
          toast.error("No se pudo cargar el perfil del usuario");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        toast.error("Error al cargar el perfil");
      }
    };

    fetchVariants();
  }, [setVariants]);

  const total = useDetailStore((state) => state.selectedService?.total ?? 0);

  const handleContinue = () => {
    navigate("/services/grooming/3");
  };

  const isContinueEnabled = true;

  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Servicios disponibles
        </h2>
      </div>

      {/* INFO GENERAL */}
      <div className="w-full h-full flex flex-col gap-4 justify-between">
        <div className="w-full flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            Fidel <PiDogFill className="size-5" />
          </h2>
          <div className="flex items-center gap-2">
            {/* {service && (
              <span className="text-xs text-[#2EA937]">Servicio (1)</span>
            )}
            {extras.length > 0 && (
              <span className="text-xs text-[#2EA937]">
                {"- "} Adicionales ({extras.length})
              </span>
            )}
            {!service && extras.length === 0 && (
              <span className="text-xs text-[#D86C00]">
                Sin opciones seleccionadas
              </span>
            )} */}
          </div>
        </div>

        {/* LISTA DE SERVICIOS */}
        <div className="w-full h-full">
          <Accordion type="single" collapsible className="w-full">
            {/* SERVICIOS PRINCIPALES */}
            <AccordionItem value="services" className="group">
              <AccordionTrigger
                extraContent={
                  <div
                    className={cn(
                      "hidden group-data-[state=closed]:block",
                      "w-full px-5 py-2 rounded-[0.5rem] border border-[#D86C00] text-[#D86C00] text-sm"
                    )}
                  >
                    Sin Servicio seleccionado
                  </div>
                }
              >
                <div className="flex flex-col gap-y-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="flex items-center gap-2 font-normal text-lg leading-[1]">
                      {selectedService?.service_name}
                      <span className="flex items-center gap-1 text-[10px] text-black/50">
                        <CiClock2 />
                        {selectedService?.time}
                      </span>
                    </h3>
                    <p className="text-black/50 leading-[1]">
                      {selectedService?.sub}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="w-full h-[320px] overflow-y-scroll flex flex-col gap-4 text-balance">
                {variants.slice(3, 7).map((item, index) => {
                  const typeService = TYPE_SERVICE_GROMMING.find(
                    (s) => s.id === item.id
                  );

                  const mergedItem = {
                    ...item,
                    ...typeService,
                  };

                  return (
                    <div
                      key={item.id}
                      className="rounded-md border p-2 flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1 leading-[1]">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-xs text-black">
                          {mergedItem.description}
                        </p>
                      </div>

                      <Button
                        className={cn(
                          index === 3 && "pointer-events-none opacity-50",
                          "bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                        )}
                        onClick={() => setVariant(item.id, item.price_delta)}
                      >
                        {index === 3 ? (
                          <span>-</span>
                        ) : (
                          <span>+ S/. {item.price_delta}.00</span>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            {/* SERVICIOS ADICIONALES */}
          </Accordion>
        </div>

        {/* Botón: Comprar */}
        <div className="w-full h-fit flex justify-between items-center">
          <Button
            className="flex w-fit items-center bg-green-600 rounded-full px-5"
            disabled={!isContinueEnabled}
            onClick={handleContinue}
          >
            Continuar
          </Button>

          <div className="flex flex-col">
            <h3 className="font-bold text-lg">Total a pagar:</h3>
            <h3 className="text-[#D86C00] font-bold text-lg -mt-1">
              S/. {total}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
