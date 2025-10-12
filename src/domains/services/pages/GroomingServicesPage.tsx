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
import { useGroomingStore } from "@/store/grooming.store";
import { Check } from "lucide-react";

export default function GroomingServicesPage() {
  const { service, extras, setService, toggleExtra } = useGroomingStore();

  const handleContinue = () => {
    console.log("Servicio:", service);
    console.log("Extras:", extras);
    // Aquí podrías navegar a la siguiente vista, por ejemplo:
    // navigate("/confirmar-servicio");
  };

  const isContinueEnabled = !!service; // solo habilitado si eligió un servicio
  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
        <FaChevronLeft />
        Servicios disponibles
      </h2>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            Fidel <PiDogFill className="size-5" />
          </h2>
          <div className="flex items-center gap-2">
            {service && (
              <span className="text-xs text-[#2EA937]">Servicio ({1})</span>
            )}
            {extras.length > 0 && (
              <span className="text-xs text-[#2EA937]">
                {"- "} Adicionales ({extras?.length})
              </span>
            )}
            {!service && extras.length === 0 && (
              <span className="text-xs text-[#D86C00]">
                Sin opciones seleccionadas
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-[70dvh] overflow-y-auto">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="services">
              <AccordionTrigger>
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-2 font-normal text-lg leading-[1]">
                    Ducha y corte de pelo{" "}
                    <span className="flex items-center gap-1 text-[10px] text-black/50">
                      <CiClock2 /> 30-45 min
                    </span>
                  </h3>
                  <p className="text-black/50 leading-[1]">Grooming</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Baño clásico</h3>
                    <p className="text-xs text-black">
                      🛁🐾 Baño clásico: shampoo/acond. hipoalergénico 🧴,
                      recorte ✂️, uñas 🐾, orejas 👂, dental 🪥, humectante 💧 y
                      perfume 🌸
                    </p>
                  </div>

                  <Button
                    className="bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => setService("clasico")}
                  >
                    {service === "clasico" ? <Check /> : "90.00"}
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Baño medicado</h3>
                    <p className="text-xs text-black">
                      🧼🐕 Baño medicado: shampoo hipocloroso 💊, recorte ✂️,
                      uñas ✋, orejas 👂, dental 🦷, humectante 💧 y perfume 🌿
                    </p>
                  </div>

                  <Button
                    className="bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => setService("medicado")}
                  >
                    {service === "medicado" ? <Check /> : "95.00"}
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Baño premium</h3>
                    <p className="text-xs text-black">
                      🌟🐾 Baño premium: shampoo intensivo 🧴, recorte ✂️, uñas
                      🐾, orejas 👂, dental 🪥, mascarilla hidratante 💧, brillo
                      de pelaje ✨ y perfume 🌸
                    </p>
                  </div>

                  <Button
                    className="bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => setService("premium")}
                  >
                    {service === "premium" ? <Check /> : "99.00"}
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Baño seco</h3>
                    <p className="text-xs text-black">
                      🌬️🐕 Baño seco: shampoo en seco 🧴, recorte ✂️, uñas 🐾,
                      orejas 👂, dental 🪥, brillo de pelaje ✨ y perfume 🌸
                    </p>
                  </div>

                  <Button
                    className="bg-[#D86C00] hover:bg-[#D86C00] text-white hover:text-white text-xs min-w-[75px]"
                    disabled
                  >
                    -
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="extras">
              <AccordionTrigger>
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-2 font-normal text-sm leading-[1] text-[#0085D8]">
                    Adicionales +
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Deslanado</h3>
                    <p className="text-xs text-black">
                      🪮🐾 Deslanado: cepillado intensivo para retirar exceso de
                      pelo
                    </p>
                  </div>

                  <Button
                    className="bg-[#0085D8] hover:bg-[#0085D8] text-white hover:text-white text-xs min-w-[75px]"
                    disabled
                  >
                    -
                  </Button>
                </div>
                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Desmotado</h3>
                    <p className="text-xs text-black">
                      🧶🐾 Desmotado: retiro de motas y nudos del pelaje ✂️🪮
                    </p>
                  </div>

                  <Button
                    className="bg-[#0085D8] hover:bg-[#0085D8] text-white hover:text-white text-xs min-w-[75px]"
                    disabled
                  >
                    -
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Pipetas antipulgas</h3>
                    <p className="text-xs text-black">
                      💊🐾 Pipetas antipulgas: eliminan y previenen pulgas 🦟,
                      protegiendo la piel y pelaje ✨
                    </p>
                  </div>

                  <Button
                    className="bg-[#0085D8] hover:bg-[#0085D8] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => toggleExtra("pipetas")}
                  >
                    {extras.includes("pipetas") ? <Check /> : "25.00"}
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Cortes</h3>
                    <p className="text-xs text-black">
                      ✂️🐾 Cortes: estilo personalizado según raza 🐶🐱, con
                      acabado prolijo, suave y brillante ✨
                    </p>
                  </div>

                  <Button
                    className="bg-[#0085D8] hover:bg-[#0085D8] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => toggleExtra("cortes")}
                  >
                    {extras.includes("cortes") ? <Check /> : "40.00"}
                  </Button>
                </div>

                <div className="rounded-md border p-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1 leading-[1]">
                    <h3 className="font-medium">Cepillo</h3>
                    <p className="text-xs text-black">
                      🪮🐾 Cepillado: elimina nudos y pelo suelto 💨, dejando el
                      pelaje suave, limpio y brillante ✨
                    </p>
                  </div>

                  <Button
                    className="bg-[#0085D8] hover:bg-[#0085D8] text-white hover:text-white text-xs min-w-[75px]"
                    onClick={() => toggleExtra("cepillo")}
                  >
                    {extras.includes("cepillo") ? <Check /> : "25.00"}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full flex items-center justify-center">
          <Button
            className="flex w-fit"
            disabled={!isContinueEnabled}
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
