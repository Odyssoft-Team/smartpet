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
import { FaCircle } from "react-icons/fa";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { CheckCheckIcon, MapPinCheck, Plus, Repeat } from "lucide-react";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  is_active: boolean;
};

import fidel_avatar from "@/assets/pets/fidel-dog.png";
import olivia_avatar from "@/assets/pets/olivia-dog.png";
import { Skeleton } from "@/components/ui/skeleton";

const TEAMS = [
  {
    name: "Fidel",
    logo: fidel_avatar,
    plan: "Chihuahua",
    address: "Av. Paseo de la Republica 2179 - San Isidro",
  },
  {
    name: "Olivia",
    logo: olivia_avatar,
    plan: "Pastor Alemán",
    address: "Jr. Felipe Gil B7 - Santiago de Surco",
  },
];

export default function HomePage() {
  const [loadingServices, setLoadingServices] = useState(false);
  const [service, setService] = useState<Service[]>([]);
  const [activeTeam, setActiveTeam] = useState(TEAMS[0]);
  const [address, setAddress] = useState(TEAMS[0].address);
  const { getServices } = useServices(); //tengo un loading aqui, puedes usarlo para mostrar un spinner

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
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
      setLoadingServices(false);
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setService]);
  return (
    <div className="w-full flex flex-col gap-4">
      {/* HEADER */}
      <div className="bg-cyan-500 fixed top-0 left-0 right-0 px-4 py-3 z-50 justify-between flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="text-white flex items-center gap-2"
            asChild
          >
            <Button
              size="lg"
              className="px-3 max-w-[12rem] bg-transparent hover:bg-transparent !p-0"
            >
              <MapPinCheck />{" "}
              <span className="truncate font-medium text-sm">{address}</span>
              <IoIosArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full rounded-lg"
            align="start"
            sideOffset={4}
          >
            {TEAMS.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setAddress(team.address)}
                className="gap-2 p-2"
              >
                {team.address}
                {team.address === address && (
                  <DropdownMenuShortcut>
                    <CheckCheckIcon className="mx-2 h-4 w-4 text-green-500" />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="px-3">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
              </div>
              <div className="bg-transparent text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={activeTeam.logo} alt={activeTeam.name} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[12rem] rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Mascotas
            </DropdownMenuLabel>
            {TEAMS.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <img src={team.logo} alt={team.name} className="shrink-0" />
                </div>
                {team.name}
                {team.name === activeTeam.name && (
                  <DropdownMenuShortcut>
                    <CheckCheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Agregar mascota
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Listado de mascotas */}
      <div className="w-full flex flex-col gap-2 overflow-hidden mt-[4rem]">
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
          Historial de servicios{" "}
          <span className="bg-[#F5F5F5] rounded-full p-1">
            <IoChevronForward />
          </span>
        </h2>

        <div className="flex flex-col gap-3">
          <Card className="p-0 rounded-md overflow-hidden shadow border-none bg-[#F5F5F5]">
            <CardContent className="flex items-center justify-between pl-2 pr-4 w-full py-3">
              <div className="flex items-center gap-3">
                <figure className="relative flex">
                  <img
                    className="size-15 rounded-full overflow-hidden object-cover"
                    src={fidel_avatar}
                    alt="asds"
                  />
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    Fidel <LuDog className="size-6" />
                  </h3>
                  <p className="font-medium text-sm leading-[1]">
                    Ducha y corte de pelo
                  </p>
                  <h2 className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-medium">
                      <FaCircle className="text-green-500 size-3" />
                      En curso{" "}
                    </span>
                  </h2>
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
          <Card className="p-0 rounded-md overflow-hidden shadow border-none bg-[#F5F5F5]">
            <CardContent className="flex items-center justify-between pl-2 pr-4 w-full py-3">
              <div className="flex items-center gap-3">
                <figure className="relative flex">
                  <img
                    className="size-15 rounded-full overflow-hidden object-cover"
                    src={fidel_circle}
                    alt="asds"
                  />
                  <span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Repeat className="size-7" />
                  </span>
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    Fidel <LuDog className="size-6" />
                  </h3>
                  <p className="font-medium text-sm leading-[1]">
                    Ducha y corte de pelo
                  </p>
                  <span className="text-muted-foreground text-xs">
                    17 de julio - 3:00 pm
                  </span>
                </div>
              </div>

              <Button>Repetir</Button>
            </CardContent>
          </Card>
          <Card className="p-0 rounded-md overflow-hidden shadow border-none bg-[#F5F5F5]">
            <CardContent className="flex items-center justify-between pl-2 pr-4 w-full py-3">
              <div className="flex items-center gap-3">
                <figure className="relative flex">
                  <img
                    className="size-15 rounded-full overflow-hidden object-cover"
                    src={fidel_circle}
                    alt="asds"
                  />
                  <span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Repeat className="size-7" />
                  </span>
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    Fidel <LuDog className="size-6" />
                  </h3>
                  <p className="font-medium text-sm leading-[1]">
                    Ducha y corte de pelo
                  </p>
                  <span className="text-muted-foreground text-xs">
                    04 de julio - 10:00 am
                  </span>
                </div>
              </div>

              <Button>Repetir</Button>
            </CardContent>
          </Card>
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
            {loadingServices
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-[80%]">
                    <Card className="p-0 border-none shadow-none rounded-none">
                      <CardContent className="flex flex-col justify-center p-0 gap-2">
                        <Skeleton className="w-full h-32 rounded-2xl mb-2" />
                        <div className="flex gap-1">
                          <Skeleton className="size-12 rounded-full overflow-hidden" />
                          <div className="w-full flex flex-col items-start gap-1 py-2">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-4 w-36" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              : service.map((item, index) => {
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
                              useDetailStore
                                .getState()
                                .setServicePrice(item.price);
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
