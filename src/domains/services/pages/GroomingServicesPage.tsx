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
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "@/store/service.store";
import {
  ADDITIONAL_SERVICE_GROMMING,
  TYPE_SERVICE_GROMMING,
} from "@/domains/home/utils/Services";
import { cn } from "@/lib/utils";

export default function GroomingServicesPage() {
  const navigate = useNavigate();

  const { selectedService, setSelectedService, toggleAdditionalService } =
    useServiceStore();

  const service = selectedService?.type_service;
  const extras = selectedService?.additional_services ?? [];

  const handleContinue = () => {
    navigate("/services/grooming/3");
  };

  const isContinueEnabled = !!service;

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Servicios disponibles
        </h2>

        <Button
          className="flex w-fit"
          disabled={!isContinueEnabled}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>

      {/* INFO GENERAL */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            Fidel <PiDogFill className="size-5" />
          </h2>
          <div className="flex items-center gap-2">
            {service && (
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
            )}
          </div>
        </div>

        {/* LISTA DE SERVICIOS */}
        <div className="w-full h-full">
          <Accordion type="single" collapsible className="w-full">
            {/* SERVICIOS PRINCIPALES */}
            <AccordionItem value="services">
              <AccordionTrigger>
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
              </AccordionTrigger>

              <AccordionContent className="w-full h-[320px] overflow-y-scroll flex flex-col gap-4 text-balance">
                {TYPE_SERVICE_GROMMING.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-md border p-2 flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-1 leading-[1]">
                      <h3 className="font-medium">{item.type_service}</h3>
                      <p className="text-xs text-black">{item.description}</p>
                    </div>

                    <Button
                      className={cn(
                        index === 3 && "pointer-events-none opacity-50",
                        "bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                      )}
                      onClick={() =>
                        setSelectedService({
                          type_service: item.type_service,
                          price: item.price,
                        })
                      }
                    >
                      {selectedService?.type_service === item.type_service ? (
                        <Check />
                      ) : (
                        <span>{item.price}</span>
                      )}
                    </Button>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* SERVICIOS ADICIONALES */}
            <AccordionItem value="extras">
              <AccordionTrigger>
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-2 font-normal text-sm leading-[1] text-[#0085D8]">
                    Adicionales +
                  </h3>
                </div>
              </AccordionTrigger>

              <AccordionContent className="w-full h-[320px] overflow-y-scroll flex flex-col gap-4 text-balance">
                {ADDITIONAL_SERVICE_GROMMING.map((addItem, index) => {
                  const isSelected =
                    selectedService?.additional_services?.some(
                      (s) => s.name === addItem.name
                    ) ?? false;

                  return (
                    <div
                      key={index}
                      className={`rounded-md border p-2 flex items-center justify-between ${
                        isSelected ? "border-[#0085D8]" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1 leading-[1]">
                        <h3 className="font-medium">{addItem.name}</h3>
                        <p className="text-xs text-black">
                          {addItem.description}
                        </p>
                      </div>

                      <Button
                        className={cn(
                          index < 2 ? "pointer-events-none opacity-50" : "",
                          isSelected ? "bg-[#006bb3]" : "bg-[#0085D8]",
                          "hover:bg-[#0085D8] text-white text-xs min-w-[75px]"
                        )}
                        onClick={() =>
                          toggleAdditionalService({
                            name: addItem.name,
                            price: addItem.price,
                          })
                        }
                      >
                        {isSelected ? <Check /> : <span>{addItem.price}</span>}
                      </Button>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
