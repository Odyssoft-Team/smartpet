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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MdOutlinePets } from "react-icons/md";
import { PiPlusBold } from "react-icons/pi";
import { useDetailStore } from "@/store/detail";
import { Skeleton } from "@/components/ui/skeleton";

import opcion_1 from "@/assets/home/serv-bano.png";
import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";

export default function GroomingPage() {
  const { setPetAndUser } = useDetailStore();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [listPets, setListPets] = useState<Pet[]>([]);

  const fetchPets = useCallback(async () => {
    try {
      const data = await getPetsByUser();
      if (data && Array.isArray(data)) {
        setListPets(data);
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
    const fetchPets = async () => {
      setLoading(true);
      if (listPets.length > 0) {
        return;
      }

      try {
        const data = await getPetsByUser();

        if (data) {
          setListPets(data);
          console.log("✅ lista de mascotas:", data);
        } else {
          toast.error("No se pudo cargar el perfil del usuario");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        toast.error("Error al cargar el perfil");
      }
      setLoading(false);
    };

    fetchPets();
  }, [listPets, setListPets]);

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
      toast.success(`Mascota seleccionada: ${selectedPet.name}`);
      navigate("/services/grooming/2");
    }
  };

  return (
    <>
      <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
        <FaChevronLeft />
        Mis Mascotas
      </h2>
      <div className="z-10 h-44 flex items-center justify-center overflow-hidden object-center  rounded-2xl">
        <img
          src={opcion_1}
          alt="Mascota 1"
          className="w-full object-cover mx-auto"
        />
      </div>
      <h2>Baño y corte</h2>
      <Separator />
      <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden bg-white z-20">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col items-center justify-center gap-1 leading-[1]">
            {/* Estoy ocultando este campo para simplicar la UI */}
            {/* <span className="font-bold text-sm">Antes del servicio</span> */}
            <h3 className="text-lg">¿Para cuál mascota deseas el servicio?</h3>
          </div>

          <Separator />

          <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
            <h3 className="font-medium text-[#D86C00] text-sm">
              seleccione una mascota porfavor
            </h3>

            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                  {/* Primer ítem: Nueva Mascota */}
                  <CarouselItem className="basis-[30%]">
                    <Link to="/registermypets">
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
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
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
    </>
  );
}
