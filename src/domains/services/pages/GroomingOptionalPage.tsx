import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDetailStore } from "@/store/detail";

import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";
import {
  getAddressByUser,
  type AddressByUser,
} from "@/domains/address/services/getAddressByUser";
import {
  getAdditionalServices,
  type AdditionalServices,
} from "../services/getAdditionalServices";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useServiceStore } from "@/store/service.store";
import { cn } from "@/lib/utils";
import { CheckCheckIcon, MapPinCheck, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function GroomingOptionalPage() {
  const navigate = useNavigate();
  const { selectedService } = useServiceStore();
  const {
    listAdditionalServices: selected,
    totalAdditionalServices,
    toggleAdditionalService,
    setPetAndUser,
    selectedPet,
    setSelectedPet,
    setLastStep,
  } = useDetailStore();

  const { profile } = useProfileStore();
  const [listAddress, setListAddress] = useState<AddressByUser[]>([]);
  const [addressSelected, setAddressSelected] = useState<AddressByUser | null>(
    null
  );

  const [listPets, setListPets] = useState<Pet[]>([]);

  const [listAdditionalServices, setListAdditionalServices] = useState<
    AdditionalServices[]
  >([]);
  const [openAccordion, setOpenAccordion] = useState<string>("item-1");

  useEffect(() => {
    const fetchAdditionalServices = async () => {
      try {
        const data = await getAdditionalServices(selectedService?.id ?? 0);

        if (data) {
          console.log("✅ Servicios adicionales cargados:", data);
          setListAdditionalServices(data);
        } else {
          toast.error("No se pudieron cargar los servicios adicionales");
        }
      } catch (error) {
        console.error("Error cargando servicios adicionales:", error);
      }
    };

    fetchAdditionalServices();
  }, [selectedService?.id]);

  const total = useDetailStore((state) => state.selectedService?.total ?? 0);

  const handleContinue = () => {
    navigate("/services/grooming/3");
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
    setLastStep("variant"); // o cambiar el tipo para incluir "optional"
  }, [setLastStep]);

  // Función para generar resumen de servicios seleccionados por categoría
  const getCategorySummary = useCallback((category: string) => {
    const selectedInCategory = selected.filter((service) => 
      listAdditionalServices.find((item) => item.id === service.id && item.category === category)
    );
    
    if (selectedInCategory.length === 0) return null;
    
    const totalPrice = selectedInCategory.reduce((sum, service) => sum + service.price, 0);
    const serviceNames = selectedInCategory.map(service => service.name).join(", ");
    
    return {
      count: selectedInCategory.length,
      names: serviceNames,
      total: totalPrice
    };
  }, [selected, listAdditionalServices]);

  // Función para manejar el cambio de acordión
  const handleAccordionChange = (value: string) => {
    // Verificar si todos los grupos tienen al menos un servicio seleccionado
    const allCategoriesHaveSelection = ["pelaje", "spa", "cuidado"].every(category => {
      const summary = getCategorySummary(category);
      return summary !== null && summary.count > 0;
    });
    
    // Si se intenta cerrar el acordión actualmente abierto
    if (value === openAccordion) {
      // Solo permitir cerrar si todos los grupos tienen selecciones
      if (allCategoriesHaveSelection) {
        setOpenAccordion(""); // Cerrar todo
      }
      // Si no todos tienen selecciones, no hacer nada (mantener abierto)
      return;
    }
    
    // Si se abre un nuevo acordión, permitir el cambio
    setOpenAccordion(value);
  };

  // Efecto para asegurar que siempre haya al menos un acordión abierto cuando sea necesario
  useEffect(() => {
    const allCategoriesHaveSelection = ["pelaje", "spa", "cuidado"].every(category => {
      const summary = getCategorySummary(category);
      return summary !== null && summary.count > 0;
    });
    
    // Si no hay acordión abierto y no todos los grupos tienen selecciones, abrir el primero
    if (!openAccordion && !allCategoriesHaveSelection) {
      setOpenAccordion("item-1");
    }
  }, [openAccordion, selected, listAdditionalServices, getCategorySummary]);

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
        {/* Encabezado */}
        <div className="w-full flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
            <FaChevronLeft />
            Servicios Adicionales
          </h2>
        </div>

        {/* SERVICIOS ADICIONALES */}
        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <h3 className="font-bold text-[#0085D8]">Adicionales+</h3>

            <Accordion
              type="single"
              collapsible
              value={openAccordion}
              onValueChange={handleAccordionChange}
              className="w-full space-y-2"
            >
              {["pelaje", "spa", "cuidado"].map((category, index) => {
                const summary = getCategorySummary(category);
                const isOpen = openAccordion === `item-${index + 1}`;
                
                return (
                  <AccordionItem
                    key={category}
                    value={`item-${index + 1}`}
                    className="border-none group"
                  >
                    <AccordionTrigger 
                      className="border h-auto py-2 px-2 capitalize"
                      extraContent={
                        !isOpen && summary ? (
                          <div className="w-full px-2 py-2 rounded-[0.5rem] border border-gray-300 text-black text-sm flex justify-between items-center mt-2">
                            <div className="w-[60%] border-r-2 px-2 font-medium text-xs">
                              <span className="font-bold text-[#2EA937]">
                                {summary.count} servicio{summary.count > 1 ? 's' : ''} seleccionado{summary.count > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="w-[40%] flex items-center justify-between px-2 h-full text-gray-500">
                              <span className="text-xs truncate">{summary.names}</span>
                              <span className="font-bold text-[#2EA937] text-xs">
                                S/. {summary.total}
                              </span>
                            </div>
                          </div>
                        ) : null
                      }
                    >
                      {category === "spa"
                        ? "AllquSpa Plus+"
                        : category === "pelaje"
                          ? "Pelaje y estilo"
                          : "Cuidado y salud"}
                    </AccordionTrigger>

                  <AccordionContent className="flex flex-col gap-4 text-balance px-2 py-2">
                    {listAdditionalServices
                      .filter((item) => item.category === category)
                      .map((item) => {
                        const isChecked = selected.some(
                          (s) => s.id === item.id
                        );

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "flex items-center gap-3 w-full justify-between",
                              item.price <= 0 &&
                                "pointer-events-none opacity-50"
                            )}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm text-[#0085D8]">
                                {item.name}
                              </span>
                              <p className="text-xs text-black">
                                {item.description}
                              </p>
                              {item.price <= 0 && (
                                <span className="text-xs text-[#D86C00] font-bold">
                                  No aplicable
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {item.price > 0 && (
                                <span className="font-bold text-[#0085D8] text-xs">
                                  S/. {item.price}
                                </span>
                              )}
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() =>
                                  toggleAdditionalService(item)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </AccordionContent>
                </AccordionItem>
              )})}
            </Accordion>
          </div>
        </div>

        {/* Botón: Continuar */}
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
  );
}