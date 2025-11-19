import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CiClock2 } from "react-icons/ci";
/* import { PiDogFill } from "react-icons/pi"; */
import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "@/store/service.store";
import { TYPE_SERVICE_GROMMING } from "@/domains/home/utils/Services";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useServices } from "@/domains/home/services/useServices";
import { toast } from "sonner";
import { useDetailStore, type ServiceVariant } from "@/store/detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CheckCheckIcon, MapPinCheck, Plus } from "lucide-react";
import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";
import {
  getAddressByUser,
  type AddressByUser,
} from "@/domains/address/services/getAddressByUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosArrowDown } from "react-icons/io";
import { useProfileStore } from "@/store/profile.store";

export default function GroomingServicesPage() {
  const navigate = useNavigate();
  // const [selectedVariant, setSelectedVariant] = useState(null);
  // const [selectedVariant] = useState(null);

  const { selectedService } = useServiceStore();
  const { getServiceVariants } = useServices();
  const {
    setVariant,
    selectedVariant,
    totalAdditionalServices,
    setPetAndUser,
    selectedPet,
    setSelectedPet,
    setLastStep,
  } = useDetailStore();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVariants]);

  const { profile } = useProfileStore();
  const [listAddress, setListAddress] = useState<AddressByUser[]>([]);
  const [addressSelected, setAddressSelected] = useState<AddressByUser | null>(
    null
  );

  const [listPets, setListPets] = useState<Pet[]>([]);

  const total = useDetailStore((state) => state.selectedService?.total ?? 0);

  const handleContinue = () => {
    navigate("/services/grooming/optional");
  };

  const isContinueEnabled = true;

  const fetchPets = useCallback(async () => {
    try {
      const data = await getPetsByUser();

      if (data && Array.isArray(data)) {
        setListPets(data);
        if (!selectedPet) {
          setSelectedPet(data[0]);
          setPetAndUser(data[0].user_id, Number(data[0].id), data[0].name);
        }
      }
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
    }
  }, [setListPets, selectedPet, setSelectedPet, setPetAndUser]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);
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

  // guardar el estado del paso actual del proceso de venta
  useEffect(() => {
    setLastStep("variant");
  }, [setLastStep]);

  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
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
          <DropdownMenuTrigger>
            <Button size="lg" className="px-3">
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

      {/* INFO GENERAL */}
      <div className="w-full h-full flex flex-col justify-between pb-[6rem] mt-20">
        {/* <div className="w-full flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            Fidel <PiDogFill className="size-5" />
          </h2>
        </div> */}

        {/* LISTA DE SERVICIOS */}
        <div className="w-full h-full flex flex-col gap-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="services"
          >
            {/* SERVICIOS PRINCIPALES */}
            <AccordionItem value="services" className="group">
              <AccordionTrigger
                extraContent={
                  <>
                    <div
                      className={cn(
                        "group-data-[state=open]:hidden group-data-[state=closed]:flex justify-between",
                        "w-full px-2 py-4 rounded-[0.5rem] border border-gray-500 text-black text-sm",
                        "flex justify-between items-center mt-2"
                      )}
                    >
                      <div className="w-[25%] h-full border-r-2 px-2 font-bold">
                        {selectedVariant ? (
                          <span className="font-bold text-[#2EA937]">
                            {selectedVariant?.name}
                          </span>
                        ) : (
                          <span className="text-gray-500">Sin servicio</span>
                        )}
                      </div>
                      <div className="w-[75%] flex items-center justify-between px-2 h-full text-gray-500">
                        <span className="text-xs">
                          Presione para realizar cambios
                        </span>
                        {selectedVariant && (
                          <span className="font-bold text-[#2EA937]">
                            S/. {selectedVariant?.price_delta}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                }
              >
                <div className="flex flex-col gap-y-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="flex items-center gap-2 font-normal text-lg leading-[1]">
                      {selectedService?.service_name}
                      <span className="flex items-center gap-1 text-[10px] text-black/50">
                        <CiClock2 />
                        {selectedService?.time} min.
                      </span>
                    </h3>
                    <p className="text-black/50 leading-[1]">
                      {selectedService?.sub}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="w-full h-fit flex flex-col mt-4">
                <Tabs defaultValue="item-0" className="w-full gap-0 !bg-none">
                  <TabsList className="w-full flex h-fit !bg-transparent p-0">
                    {variants.slice(3, 7).map((item, index) => {
                      const typeService = TYPE_SERVICE_GROMMING[index];
                      const mergedItem = { ...item, ...typeService };
                      return (
                        <TabsTrigger
                          key={item.id}
                          value={`item-${index}`}
                          className={cn(
                            "relative rounded-t-[1rem] rounded-b-none !shadow-none border-x-2 border-t-2 border-b-0 border-gray-300 transition-colors duration-200 flex flex-col items-center justify-center",
                            "py-2 h-16 text-xs font-bold",
                            // Efecto "carpeta": cuando está activo, sin borde inferior visible
                            "data-[state=active]:mb-[0px] data-[state=active]:bg-white z-20",
                            index === 0 &&
                              "data-[state=active]:font-bold data-[state=active]:text-[#D86C00] data-[state=active]:border-t-[#D86C00] data-[state=active]:border-x-[#D86C00]",
                            index === 1 &&
                              "data-[state=active]:font-bold data-[state=active]:text-sky-500 data-[state=active]:border-t-sky-500 data-[state=active]:border-x-sky-500",
                            index === 2 &&
                              "data-[state=active]:font-bold data-[state=active]:text-yellow-500 data-[state=active]:border-t-yellow-500 data-[state=active]:border-x-yellow-500",
                            index === 3 &&
                              "data-[state=active]:font-bold data-[state=active]:text-neutral-500 data-[state=active]:border-t-neutral-500 data-[state=active]:border-x-neutral-500"
                          )}
                        >
                          {item.name}
                          <img
                            src={mergedItem.icon}
                            alt={`icon-${item.name}`}
                            className="h-8 w-auto -mt-1"
                          />
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {variants.slice(3, 7).map((item, index) => {
                    const typeService = TYPE_SERVICE_GROMMING[index];
                    const mergedItem = { ...item, ...typeService };

                    return (
                      <TabsContent
                        key={item.id}
                        value={`item-${index}`}
                        className={cn(
                          "py-4 px-0 border-2 flex flex-col gap-y-2 items-center text-center rounded-b-[1rem] transition-colors duration-200 border-gray-300",
                          // Hace que el borde superior “se una” con el tab activo
                          "-mt-[2px]",
                          index === 0 && "data-[state=active]:border-[#D86C00]",
                          index === 1 && "data-[state=active]:border-sky-500",
                          index === 2 &&
                            "data-[state=active]:border-yellow-500",
                          index === 3 &&
                            "data-[state=active]:border-neutral-500"
                        )}
                      >
                        <h3 className="text-base font-semibold">
                          {mergedItem.commend}
                        </h3>
                        <div className="w-full px-4">
                          <p className="text-[12px] text-black text-left">
                            {mergedItem.description ||
                              "Sin descripción disponible"}
                          </p>
                        </div>

                        <div className="w-full flex flex-col gap-y-3 mt-1 bg-gray-200/60 py-4 px-5">
                          {mergedItem.includes?.map((include, i) => (
                            <div
                              key={i}
                              className="flex items-center text-left gap-x-1"
                            >
                              <div
                                className={cn(
                                  "size-4 flex items-center justify-center rounded-full",
                                  index === 0 && "bg-[#D86C00]",
                                  index === 1 && "bg-sky-500",
                                  index === 2 && "bg-yellow-500",
                                  index === 3 && "bg-neutral-500"
                                )}
                              >
                                <Check
                                  className="size-2 text-white"
                                  strokeWidth={5}
                                />
                              </div>
                              <span className="text-xs text-black tracking-tighter">
                                {include}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className={cn(
                            "bg-[#D86C00] text-white text-xs min-w-[75px]",
                            index === 0 && "bg-[#D86C00]",
                            index === 1 && "bg-sky-500",
                            index === 2 && "bg-yellow-500",
                            index === 3 &&
                              "pointer-events-none opacity-50 bg-neutral-500"
                          )}
                          onClick={() => {
                            setVariant(item.id, item.price_delta, item.name);
                            // setSelectedVariant(item.id);
                          }}
                        >
                          {selectedVariant?.id === item.id ? (
                            <Check
                              className="w-4 h-4 text-white"
                              strokeWidth={3}
                            />
                          ) : index === 3 ? (
                            <span>-</span>
                          ) : (
                            <span>S/. {item.price_delta}.00</span>
                          )}
                        </Button>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </AccordionContent>
            </AccordionItem>

            {/* SERVICIOS ADICIONALES */}
          </Accordion>

          {/* Botón: Comprar */}
          <div className="w-full h-auto flex justify-between items-center fixed left-0 right-0 px-4 bottom-16 bg-white border-t py-3">
            <Button
              className="flex w-fit items-center bg-green-600 rounded-full px-5"
              disabled={!isContinueEnabled}
              onClick={handleContinue}
            >
              Continuar
            </Button>

            <div className="flex flex-col justify-end items-end">
              <h3 className="font-bold text-lg">Total a pagar</h3>
              <h3 className="text-[#D86C00] font-bold text-lg -mt-1">
                S/. {total + totalAdditionalServices}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
