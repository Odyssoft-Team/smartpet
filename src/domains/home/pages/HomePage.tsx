import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaRegClock, FaRegHeart } from "react-icons/fa";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { TbUserCheck } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
import { IoChevronForward } from "react-icons/io5";
import { LuDog } from "react-icons/lu";

import fidel from "@/assets/home/fidel.png";
import fidel_circle from "@/assets/home/fidel-circle.png";
import opcion_1 from "@/assets/home/opcion-1.png";
import opcion_2 from "@/assets/home/opcion-2.png";
import opcion_3 from "@/assets/home/opcion-3.png";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Carrusel de botones */}
      <div className="w-full overflow-hidden">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="gap-2">
            <CarouselItem className="basis-[27%]">
              <Card className="p-0 rounded-md">
                <CardContent className="flex items-center justify-center p-1 gap-1">
                  <button className="flex items-center gap-1">
                    <FaRegHeart className="size-4" />
                    <span className="text-sm font-medium">Favoritos</span>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="basis-[27%] pl-0">
              <Card className="p-0 rounded-md">
                <CardContent className="flex items-center justify-center p-1 gap-1">
                  <button className="flex items-center gap-1">
                    <PiClockCounterClockwiseBold className="size-4" />
                    <span className="text-sm font-medium">Historial</span>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="basis-[27%] pl-0">
              <Card className="p-0 rounded-md">
                <CardContent className="flex items-center justify-center p-1 gap-1">
                  <button className="flex items-center gap-1">
                    <TbUserCheck className="size-4" />
                    <span className="text-sm font-medium">Consultas</span>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="basis-[27%] pl-0">
              <Card className="p-0 rounded-md">
                <CardContent className="flex items-center justify-center p-1 gap-1">
                  <button className="flex items-center gap-1">
                    <CiViewList className="size-4" />
                    <span className="text-sm font-medium">Pedidos</span>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Listado de mascotas */}
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <h2 className="font-bold flex items-center gap-3 text-base">
          Mascotas{" "}
          <span className="bg-[#F5F5F5] rounded-full p-1">
            <IoChevronForward />
          </span>
          <p className="text-xs text-[#0085D8] font-normal">
            Desliza para alternar entre mascotas
          </p>
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="">
              <Card className="p-0 rounded-md overflow-hidden">
                <CardContent className="flex items-center justify-center p-0 w-full h-[7rem]">
                  <img
                    className="w-full h-full object-cover"
                    src={fidel}
                    alt="asds"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="">
              <Card className="p-0 rounded-md overflow-hidden">
                <CardContent className="flex items-center justify-center p-0 w-full h-[7rem]">
                  <img
                    className="w-full h-full object-cover"
                    src={fidel}
                    alt="asds"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Separator />

      {/* Servicios */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="font-bold flex items-center gap-3 text-base">
          Servicios{" "}
          <span className="bg-[#F5F5F5] rounded-full p-1">
            <IoChevronForward />
          </span>
        </h2>

        <div className="flex flex-col gap-1">
          <Card className="p-0 rounded-md overflow-hidden shadow-none border-none bg-[#F5F5F5]">
            <CardContent className="flex items-center justify-between pl-2 pr-4 w-full h-[6.5rem]">
              <div className="flex items-center gap-3">
                <figure className="relative flex">
                  <img
                    className="size-21 rounded-full overflow-hidden object-cover"
                    src={fidel_circle}
                    alt="asds"
                  />
                  <span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <FaRegClock className="size-7" />
                  </span>
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    Fidel <LuDog className="size-6" />
                  </h3>
                  <p className="font-medium text-sm leading-[1]">
                    Ducha y corte de pelo
                  </p>
                  <span className="text-muted-foreground text-sm">
                    17 de julio - 3:00 pm
                  </span>
                </div>
              </div>

              <Button>Repetir</Button>
            </CardContent>
          </Card>

          <p className="text-black/40 text-sm font-normal leading-[1]">
            Visualize el último servicio contratado
          </p>
        </div>
      </div>

      <Separator />

      <div className="w-full flex flex-col items-center justify-center gap-2 overflow-hidden">
        <h2 className="font-bold flex items-center gap-3 text-lg text-[#D86C00]">
          Otras opciones{" "}
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="basis-[40%]">
              <Card className="p-0 border-none shadow-none rounded-none">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <img
                    className="w-full overflow-hidden object-cover"
                    src={opcion_1}
                    alt="asds"
                  />
                  <div className="w-full flex flex-col items-start gap-1 py-2">
                    <h3 className="leading-[1] font-normal text-sm text-black/50">
                      Grooming
                    </h3>
                    <p className="leading-[1] font-medium text-sm text-black">
                      Ducha y corte de pelo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="basis-[40%]">
              <Card className="p-0 border-none shadow-none rounded-none">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <img
                    className="w-full overflow-hidden object-cover"
                    src={opcion_2}
                    alt="asds"
                  />
                  <div className="w-full flex flex-col items-start gap-1 py-2">
                    <h3 className="leading-[1] font-normal text-sm text-black/50">
                      Caring
                    </h3>
                    <p className="leading-[1] font-medium text-sm text-black">
                      Paseo de mascota
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="basis-[40%]">
              <Card className="p-0 border-none shadow-none rounded-none">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <img
                    className="w-full overflow-hidden object-cover"
                    src={opcion_3}
                    alt="asds"
                  />
                  <div className="w-full flex flex-col items-start gap-1 py-2">
                    <h3 className="leading-[1] font-normal text-sm text-black/50">
                      Caring
                    </h3>
                    <p className="leading-[1] font-medium text-sm text-black">
                      Estadía
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
