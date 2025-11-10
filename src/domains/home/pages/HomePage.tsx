"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaCircle, FaRegClock } from "react-icons/fa";
import { CiRoute } from "react-icons/ci";
import { IoChevronForward } from "react-icons/io5";
import { LuDog } from "react-icons/lu";

import fidel from "@/assets/home/fidel.png";
import fidel_circle from "@/assets/home/fidel-circle.png";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { SERVICES } from "../utils/Services";
import { cn } from "@/lib/utils";
import { useServiceStore } from "@/store/service.store";
import { useEffect, useState } from "react";
import { useServices } from "../services/useServices";
import { toast } from "sonner";
import { useDetailStore } from "@/store/detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { HiMapPin } from "react-icons/hi2";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  is_active: boolean;
};

export default function HomePage() {
  const [service, setService] = useState<Service[]>([]);
  const { getServices } = useServices(); //tengo un loading aqui, puedes usarlo para mostrar un spinner

  useEffect(() => {
    const fetchServices = async () => {
      if (service.length > 0) {
        console.log("✅ Ya hay datos, omitiendo fetch");
        return;
      }
      try {
        const data = await getServices();

        if (data) {
          setService(data);
          console.log("✅ Servicios cargados:", data);
        } else {
          toast.error("No se pudo cargar el perfil del usuario");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        toast.error("Error al cargar el perfil");
      }
    };

    fetchServices();
  }, [setService]);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-black fixed top-0 left-0 right-0 px-4 py-3 z-50 justify-between flex items-center">
        {/* <div
          className={cn(
            "w-full flex flex-col gap-y-3 overflow-y-scroll transition-all duration-300 ease-in-out ",
            openCard ? "h-[120px]" : "h-[0px]"
          )}
        ></div> */}
        {/* <span className="text-white"></span> */}
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white flex items-center gap-2">
            Alameda El Alba 110 <IoIosArrowDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-black text-white w-full border-0"
            align="start"
          >
            <DropdownMenuItem>
              <HiMapPin /> Paseo de la Republica 2179 - San Isidro
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HiMapPin /> Juan de Aliaga 488 - Magdalena del Mar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HiMapPin /> Jr Felipe Gil B7 - Santiago de Surco
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-white w-8 h-8 rounded-full">:)</div>
      </div>

      {/* Listado de mascotas */}
      <div className="w-full flex flex-col gap-2 overflow-hidden mt-14">
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

      <div className="w-full flex flex-col gap-2">
        <h2 className="font-bold flex items-center gap-3 text-base">
          <span className="flex items-center gap-2 ">
            <FaCircle className="text-green-500 size-4" />
            En curso{" "}
          </span>
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
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <CiRoute className="size-5" /> En camino
                  </span>
                </div>
              </div>

              <Link
                to={"/activities"}
                className="bg-primary text-white px-3 rounded-md py-1"
              >
                Ver
              </Link>
            </CardContent>
          </Card>
        </div>
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

      {/* OTRAS OCIONES DE SERVICIOS */}

      <div className="w-full flex flex-col items-center justify-center gap-2 overflow-hidden">
        <h2 className="font-bold flex items-center gap-3 text-lg text-[#D86C00]">
          Otras opciones
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {service.map((item, index) => {
              const typeService = SERVICES.find((s) => s.id === item.id);

              const mergedItem = {
                ...item,
                ...typeService,
              };

              return (
                <CarouselItem key={item.id} className="basis-[80%]">
                  <Card className="p-0 border-none shadow-none rounded-none">
                    <Link
                      to="/services/grooming"
                      onClick={() => {
                        if (index === 0) {
                          useServiceStore.getState().setSelectedService({
                            id: item.id,
                            service_name: item.name,
                            sub: item.description,
                            time: item.duration,
                          });
                        }

                        if (index === 0) {
                          useDetailStore.getState().setServicePrice(item.price);
                        }
                      }}
                      className={cn(
                        index === 0
                          ? "pointer-events-auto"
                          : "pointer-events-none opacity-80 cursor-not-allowed"
                      )}
                    >
                      <CardContent className="flex flex-col justify-center p-0 gap-2">
                        <div className="w-full h-fit relative">
                          <img
                            className="w-full h-auto object-cover rounded-2xl"
                            src={mergedItem.img}
                            alt="asds"
                          />
                          <div
                            className={cn(
                              "w-full h-full inset-0 bg-white/50 absolute z-10",
                              index === 0 && "hidden"
                            )}
                          />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-15">
                            <img
                              className="size-12 rounded-full overflow-hidden object-cover"
                              src={fidel_circle}
                              alt="asds"
                            />
                          </div>
                          <div className="w-full flex flex-col items-start gap-1 py-2">
                            <h3 className="leading-[1] font-normal text-sm text-black/50">
                              {item.name}
                            </h3>
                            <p className="leading-[1] font-medium text-sm text-black">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
