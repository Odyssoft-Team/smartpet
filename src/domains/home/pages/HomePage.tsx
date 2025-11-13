"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FaCircle } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { LuDog } from "react-icons/lu";

import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { SERVICES } from "../utils/Services";
import { cn } from "@/lib/utils";
import { useServiceStore } from "@/store/service.store";
import { useCallback, useEffect, useState } from "react";
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

import fondo from "@/assets/home/fondo_pet.png";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  created_at: string;
  is_active: boolean;
};

import fidel_avatar from "@/assets/pets/fidel-dog.png";
// import olivia_avatar from "@/assets/pets/olivia-dog.png";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAddressByUser,
  type AddressByUser,
} from "@/domains/address/services/getAddressByUser";
import { useProfileStore } from "@/store/profile.store";
import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  const [loadingServices, setLoadingServices] = useState(false);
  const [listServices, setListServices] = useState<Service[]>([]);

  const { getServices } = useServices(); //tengo un loading aqui, puedes usarlo para mostrar un spinner
  const { profile } = useProfileStore();
  const [listAddress, setListAddress] = useState<AddressByUser[]>([]);
  const [addressSelected, setAddressSelected] = useState<AddressByUser | null>(
    null
  );
  const [listPets, setListPets] = useState<Pet[]>([]);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [idxCarousel, setIdxCarousel] = useState<number>(0);

  // ✅ Escuchar los cambios del carousel (cuando el usuario desliza)
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setIdxCarousel(idx);
      setSelectedPet(listPets[idx]);
    };

    api.on("select", onSelect);

    // ✅ cleanup correcto para TypeScript
    return () => {
      api.off("select", onSelect);
    };
  }, [api, listPets]);

  // ✅ Mover el carousel cuando cambia el índice externamente (por ej. desde el combobox)
  useEffect(() => {
    if (api && typeof idxCarousel === "number") {
      api.scrollTo(idxCarousel);
    }
  }, [idxCarousel, api]);

  const { setSelectedService } = useServiceStore();
  const { setServicePrice } = useDetailStore();

  const fetchPets = useCallback(async () => {
    try {
      const data = await getPetsByUser();

      if (data && Array.isArray(data)) {
        setListPets(data);
        setSelectedPet(data[0]);
      }
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
    }
  }, [setListPets]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const data = await getServices();

        if (data) {
          setListServices(data);

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
  }, []);

  const fetchAddress = async () => {
    const data = await getAddressByUser(profile.id);
    if (data) {
      const defaultAddress = data.find((item) => item.is_default === true);
      setListAddress(data);
      setAddressSelected(defaultAddress || data[0]);
    }
  };

  useEffect(() => {
    if (profile.id) {
      fetchAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

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
              className="px-3 max-w-[13rem] bg-transparent hover:bg-transparent !p-0"
            >
              <MapPinCheck />{" "}
              <span className="truncate font-medium text-sm">
                {addressSelected?.address}
              </span>
              <IoIosArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full rounded-lg"
            align="start"
            sideOffset={4}
          >
            {listAddress.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => {
                  setAddressSelected(team);
                }}
                className="gap-2 p-2"
              >
                {team.address}
                {team.address === addressSelected?.address && (
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
            <Button size="lg" className="px-3 bg-cyan-600">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedPet?.name}
                </span>
              </div>

              <Avatar className="size-7">
                <AvatarImage
                  src={selectedPet?.photo_url as string}
                  alt={selectedPet?.name}
                />
                <AvatarFallback className="font-bold text-black">
                  {selectedPet?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
            {listPets.length > 0 &&
              listPets.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => {
                    setSelectedPet(team);
                    setIdxCarousel(listPets.indexOf(team));
                  }}
                  className="gap-2 p-2"
                >
                  <Avatar className="size-6">
                    <AvatarImage
                      src={team.photo_url as string}
                      alt={team.name}
                    />
                    <AvatarFallback>
                      {team.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {team.name}
                  {team.name === selectedPet?.name && (
                    <DropdownMenuShortcut>
                      <CheckCheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <Link to={"/register-pet/step1"}>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Agregar mascota
                </div>
              </DropdownMenuItem>
            </Link>
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
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {listPets.map((pet) => (
              <CarouselItem key={pet.id}>
                <Card className="p-0 rounded-md overflow-hidden">
                  <CardContent className="flex items-center justify-center p-0 w-full h-[7rem] relative">
                    <div className="w-full absolute flex items-center justify-center gap-4">
                      {/* <img
                        className="size-20 object-cover"
                        src={pet.photo_url as string}
                        alt={pet?.name}
                      /> */}
                      <Avatar className="size-20">
                        <AvatarImage
                          src={pet.photo_url as string}
                          alt={pet?.name}
                        />
                        <AvatarFallback className="font-bold text-xl">
                          {pet?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="font-bold text-white capitalize">
                        {pet.name}
                      </h2>
                    </div>
                    <img
                      className="w-full h-full object-cover"
                      src={fondo}
                      alt="asds"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Separator />

      {/* Historial de Servicios */}
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
                    src={(listPets[0]?.photo_url as string) || fidel_avatar}
                    alt="asds"
                  />
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    {listPets[0]?.name} <LuDog className="size-6" />
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
                    src={(listPets[0]?.photo_url as string) || fidel_avatar}
                    alt="asds"
                  />
                  <span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Repeat className="size-7" />
                  </span>
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    {listPets[0]?.name} <LuDog className="size-6" />
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
                    src={(listPets[0]?.photo_url as string) || fidel_avatar}
                    alt="asds"
                  />
                  <span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Repeat className="size-7" />
                  </span>
                </figure>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold flex items-center gap-1 text-lg leading-[1]">
                    {listPets[0]?.name} <LuDog className="size-6" />
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

      {/* OTROS SERVICIOS */}

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
              : listServices.map((item, index) => {
                  const typeService = SERVICES.find((s) => s.id === item.id);

                  return (
                    <CarouselItem key={item.id} className="basis-[80%]">
                      <Card className="p-0 border-none shadow-none rounded-none">
                        <Link
                          to="/services/grooming"
                          onClick={() => {
                            if (index === 0) {
                              setSelectedService({
                                id: item.id,
                                service_name: item.name,
                                sub: item.description,
                                time: item.duration_minutes,
                              });
                              setServicePrice(item.price);
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
                                src={typeService?.img}
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
                                  src={
                                    (listPets[0]?.photo_url as string) ||
                                    fidel_avatar
                                  }
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

        <div className="bg-yellow-500 w-full mt-4 rounded-2xl p-4">Conoce los beneficios</div>
      </div>
    </div>
  );
}
