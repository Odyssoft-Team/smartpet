import { Separator } from "@/components/ui/separator";
import { FaChevronLeft } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import corto from "@/assets/grooming/corto.png";
import mediano from "@/assets/grooming/mediano.png";
import largo from "@/assets/grooming/largo.png";
import doble from "@/assets/grooming/doble.png";

import normal from "@/assets/grooming/normal.png";
import mota from "@/assets/grooming/mota.png";
import enredado from "@/assets/grooming/enredado.png";
import estacional from "@/assets/grooming/estacional.png";
import {
  useGroomingStore,
  type CoatCondition,
  type HairType,
} from "@/store/grooming.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function GroomingPage() {
  const { hairType, coatCondition, setHairType, setCoatCondition } =
    useGroomingStore();

  // ✅ Validación para el botón
  const isComplete = !!hairType && !!coatCondition;
  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
        <FaChevronLeft />
        Mis servicios
      </h2>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col items-center justify-center gap-1 leading-[1]">
          <span className="font-bold text-sm">Antes del servicio</span>
          <h3 className="text-lg">¿Cómo es el pelaje de tu mascota?</h3>
        </div>

        <Separator />

        <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="font-medium text-[#D86C00] text-sm">Tipo de pelaje</h3>

          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {[
                { key: "corto", img: corto },
                { key: "mediano", img: mediano },
                { key: "largo", img: largo },
                { key: "doble", img: doble },
              ].map((item) => (
                <CarouselItem
                  key={item.key}
                  onClick={() => setHairType(item.key as HairType)}
                  className="basis-[30%]"
                >
                  <Card className="p-0 rounded-none border-none shadow-none gap-2">
                    <CardContent
                      className={cn(
                        "flex flex-col gap-1 items-center justify-center p-0 border rounded-md",
                        hairType === item.key
                          ? "border-[#2EA937]"
                          : "border-black"
                      )}
                    >
                      <img src={item.img} alt={item.key} />
                    </CardContent>
                    <p
                      className={cn(
                        "font-medium text-sm capitalize",
                        hairType === item.key ? "text-[#2EA937]" : ""
                      )}
                    >
                      {item.key}
                    </p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="font-medium text-[#0085D8] text-sm">
            Estado de pelaje
          </h3>

          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {[
                { key: "normal", img: normal },
                { key: "mota", img: mota },
                { key: "enredado", img: enredado },
                { key: "estacional", img: estacional },
              ].map((item) => (
                <CarouselItem
                  key={item.key}
                  onClick={() => setCoatCondition(item.key as CoatCondition)}
                  className="basis-[30%]"
                >
                  <Card className="p-0 rounded-none border-none shadow-none gap-2">
                    <CardContent
                      className={cn(
                        "flex flex-col gap-1 items-center justify-center p-0 border rounded-md",
                        coatCondition === item.key
                          ? "border-[#2EA937]"
                          : "border-black"
                      )}
                    >
                      <img src={item.img} alt={item.key} />
                    </CardContent>
                    <p
                      className={cn(
                        "font-medium text-sm capitalize",
                        coatCondition === item.key ? "text-[#2EA937]" : ""
                      )}
                    >
                      {item.key}
                    </p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="w-full flex items-center justify-center">
          <Button
            className="mt-10 flex w-fit"
            disabled={!isComplete}
            variant={isComplete ? "default" : "secondary"}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
