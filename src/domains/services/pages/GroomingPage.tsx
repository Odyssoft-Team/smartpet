/* import { Separator } from "@/components/ui/separator";
import { FaChevronLeft } from "react-icons/fa"; */

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MdOutlinePets } from "react-icons/md";
import { PiPlusBold } from "react-icons/pi";
import { useDetailStore } from "@/store/detail";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAddressByUser,
  type AddressByUser,
} from "@/domains/address/services/getAddressByUser";
import { useProfileStore } from "@/store/profile.store";
import opcion_1 from "@/assets/home/serv-bano.png";
import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCheckIcon, MapPinCheck, Plus } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GroomingPage() {

  const { profile } = useProfileStore();
    const [listAddress, setListAddress] = useState<AddressByUser[]>([]);
    const [addressSelected, setAddressSelected] = useState<AddressByUser | null>(
      null
    );
  const { setPetAndUser } = useDetailStore();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [listPets, setListPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await getPetsByUser();
        if (data && Array.isArray(data)) {
          setListPets(data);
          console.log("✅ lista de mascotas:", data);
        }
      } catch (error) {
        console.error("Error obteniendo las mascotas:", error);
        toast.error("No se pudieron cargar las mascotas");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const navigate = useNavigate();

  // ✅ Validación para el botón
  const handleContinue = () => {
    if (!selectedPetId) {
      toast.error("Por favor, selecciona una mascota antes de continuar");
      return;
    }

    const selectedPet = listPets.find((pet) => pet.id === selectedPetId);
    if (selectedPet) {
      setPetAndUser(selectedPet.user_id, Number(selectedPet.id));
      navigate("/services/grooming/2");
    }
  };


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
    <div className="flex flex-col gap-4">
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
            {listPets.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => {
                  setSelectedPet(team);
                  //setIdxCarousel(listPets.indexOf(team));
                }}
                className="gap-2 p-2"
              >
                <Avatar className="size-6">
                  <AvatarImage src={team.photo_url as string} alt={team.name} />
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
      {/* <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
        <FaChevronLeft />
        Mis Mascotas
      </h2> */}
      <div className="z-10 h-60 fixed top-12 left-0 right-0 items-center justify-center overflow-hidden object-center  rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <img
          src={opcion_1}
          alt="Mascota 1"
          className="w-full object-cover mx-auto"
        />
      </div>
      <h2>Baño y corte</h2>
      {/* <Separator /> */}
      <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden bg-white z-20 top-60">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col items-center justify-center gap-1 leading-[1]">
            {/* Estoy ocultando este campo para simplicar la UI */}
            {/* <span className="font-bold text-sm">Antes del servicio</span> */}
            <h3 className="text-lg">¿Para cuál mascota deseas el servicio?</h3>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
            {selectedPetId ? (
              <h3 className="font-normal text-black/50 text-sm">
                Mascota seleccionada{" "}
                <span className="font-bold text-black capitalize">
                  {listPets.find((pet) => pet.id === selectedPetId)?.name}
                </span>
              </h3>
            ) : (
              <h3 className="font-normal text-[#D86C00] text-sm">
                Seleccione una mascota por favor
              </h3>
            )}

            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {/* Primer ítem: Nueva Mascota */}
                <CarouselItem className="basis-[30%]">
                  <Link to="/register-pet/step1">
                    <Card className="p-0 rounded-none border-none shadow-none gap-2">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <div className="size-22 flex items-center justify-center rounded-full bg-gray-200">
                          <PiPlusBold
                            className="size-7 text-gray-400"
                            strokeWidth={10}
                          />
                        </div>
                        <p className="font-medium text-sm text-gray-500 mt-2">
                          Nueva Mascota
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>

                {/* skeleton */}
                {loading && (
                  <div className="flex gap-4 basis-[30%] ml-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="size-22 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Lista de mascotas */}
                {listPets.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="basis-[30%]"
                    onClick={() => setSelectedPetId(item.id)}
                  >
                    <Card className="p-0 rounded-none border-none shadow-none gap-2 cursor-pointer hover:opacity-80 transition">
                      <CardContent
                        className={cn(
                          "flex flex-col gap-1 items-center justify-center p-0",
                          "size-22 rounded-full border border-black overflow-hidden",
                          selectedPetId === item.id
                            ? "border-[#2EA937]"
                            : "border-black"
                        )}
                      >
                        {item.photo_url ? (
                          <img
                            src={item.photo_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <MdOutlinePets className="size-10 text-gray-600" />
                          </div>
                        )}
                      </CardContent>
                      <p
                        className={cn(
                          "font-medium text-sm capitalize text-center mt-2",
                          selectedPetId === item.id
                            ? "text-[#2EA937]"
                            : "text-black"
                        )}
                      >
                        {item.name}
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
              disabled={!selectedPetId}
              variant={selectedPetId ? "default" : "secondary"}
              onClick={handleContinue}
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
