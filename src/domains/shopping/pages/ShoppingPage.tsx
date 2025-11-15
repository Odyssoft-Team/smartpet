import { FaChevronLeft } from "react-icons/fa";
import { useServiceStore } from "@/store/service.store";
import { PiDogFill } from "react-icons/pi";
import { CiClock2 } from "react-icons/ci";
import { useCardsStore } from "@/store/card.store";
import MaskedCard from "@/domains/profile/components/MaskedCard";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiPencil } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { PaymentSuccess } from "../components/DialogSucessPay";
import { useDetailStore } from "@/store/detail";
import { Separator } from "@/components/ui/separator";
import {
  addServiceOrder,
  type ServiceOrder,
} from "../services/addServiceOrder";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ShoppingPage() {
  // const { selectedService, setSelectedService } = useServiceStore();
  const { selectedService, clearService } = useServiceStore();
  const {
    selectedService: selectedServiceBeta,
    listAdditionalServices,
    totalAdditionalServices,
    selectedDateService,
    selectedVariant,
    selectedPet,
    reset: resetDetailStore,
    setLastStep,
  } = useDetailStore();
  const navigate = useNavigate();

  const hasService = selectedService && Object.keys(selectedService).length > 0;

  const { listCards } = useCardsStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  // Función para manejar la selección/deselección de tarjeta
  const handleSelectCard = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  };

  // Función para procesar el pago
  const handlePayment = async () => {
    if (!selectedCardId) return;

    setLoading(true);

    const data: ServiceOrder = {
      user_id: selectedServiceBeta?.user_id as string,
      card_id: selectedCardId,
      pet_id: selectedPet?.id as number,
      variant_id: selectedVariant?.id as number,
      scheduled_date: format(selectedDateService as Date, "yyyy-MM-dd"),
      notes: "",
      total:
        totalAdditionalServices + (selectedServiceBeta?.price_service ?? 0),
      payment_status: "paid",
      scheduled_time: "10:00 am",
      status: "pending",
    };

    try {
      const response = await addServiceOrder(data);

      console.log("dataaaa", data);

      if (response) {
        setShowSuccessDialog(true);
        setTimeout(() => {
          resetDetailStore();
          clearService();
          setShowSuccessDialog(false);
          navigate("/");
        }, 2000);
      } else {
        toast.error("Error al registrar la orden de servicio");
      }
    } catch (error) {
      console.log("Error al registrar la orden de servicio", error);
    }

    setLoading(false);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // setSelectedService(null);
    navigate("/");
  };

  // guardar el estado del paso actual del proceso de venta
  useEffect(() => {
    setLastStep("payment");
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center overflow-hidden">
      {/* Encabezado */}
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Mi Carrito
        </h2>
      </div>

      {/* Contenido */}
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {hasService ? (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold">
                {selectedPet?.name} <PiDogFill className="size-5" />
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"></div>
                <Link
                  to={"/services/grooming/2"}
                  className="flex items-center justify-center rounded-md py-1 px-2 gap-2 border size-8"
                >
                  <HiPencil className="text-sky-600" />
                </Link>
              </div>
            </div>

            <Separator />

            <div className="w-full flex justify-between items-center">
              <div className="w-fit">
                <h3 className="flex items-center gap-x-2 font-medium -mb-2">
                  {selectedService.service_name}
                  <span className="text-xs flex items-center gap-x-1 text-gray-400">
                    <CiClock2 strokeWidth={1} /> {selectedService.time} min.
                  </span>
                </h3>
                <span className="text-sm text-gray-400">
                  {selectedService.sub}
                </span>
              </div>

              <h3 className="w-fit font-bold text-sm text-[#D86C00]">
                S/.{selectedServiceBeta?.price_delta}
              </h3>
            </div>

            <div className="w-full flex flex-col">
              <div className="w-full flex items-center justify-between">
                <h3 className="font-bold text-[#0085D8]">Adicionales+</h3>
                <span className="w-fit font-bold text-sm text-[#D86C00]">
                  S/. {totalAdditionalServices}
                </span>
              </div>
              {listAdditionalServices.map((item) => {
                return (
                  <div
                    className="w-full flex justify-between items-center"
                    key={item.id}
                  >
                    <div className="w-fit flex flex-col leading-[1.2]">
                      <h3 className="flex items-center gap-x-2 font-medium text-sm">
                        {item?.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {item?.description}
                      </span>
                      <span className="text-xs font-bold">
                        S/. {item?.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="w-full flex items-center justify-end font-bold text-[#2EA937]">
              Total: S/.{" "}
              {totalAdditionalServices +
                (selectedServiceBeta?.price_service ?? 0)}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No hay servicios seleccionados
          </p>
        )}
      </div>

      {/* Medios de pago */}
      <div className="w-full flex flex-col justify-center gap-2">
        <h2 className="flex flex-col font-bold text-xl w-full text-start">
          Medios de pago
          <span className="text-[13px] font-normal text-gray-400">
            Seleccione un medio de pago
          </span>
        </h2>

        <div className="flex items-center justify-between gap-x-2 text-sm">
          Tarjeta de crédito/débito
          <button
            onClick={() => setOpenCard(!openCard)}
            className="size-5 flex items-center justify-center rounded-full bg-gray-200"
          >
            <IoIosArrowDown
              className={cn(
                "size-4 text-black",
                openCard ? "rotate-180" : "rotate-0"
              )}
              strokeWidth={12}
            />
          </button>
        </div>

        <div
          className={cn(
            "w-full flex flex-col gap-y-3 overflow-y-scroll transition-all duration-300 ease-in-out ",
            openCard ? "h-[120px]" : "h-[0px]"
          )}
        >
          {listCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleSelectCard(card.id)}
              className="w-full flex rounded-xl bg-gray-200 py-4 cursor-pointer"
            >
              <div className="w-[28%] flex justify-center items-center">
                <div className="w-12 h-8 flex flex-col rounded-[0.2rem] overflow-hidden">
                  <div className="w-full h-[20%] bg-sky-600"></div>
                  <div className="w-full h-[20%] bg-black"></div>
                  <div className="w-full h-[60%] bg-sky-600"></div>
                </div>
              </div>
              <div className="w-[72%] flex items-center justify-between pl-3 pr-5 border-l-[2px] border-gray-500">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#D86C00]">
                    {card.label}
                  </div>
                  <div className="text-sm flex items-center gap-x-2 ml-1">
                    VISA <MaskedCard cardNumber={card.card_number} />
                  </div>
                </div>

                {/* Botón de selección */}
                <div
                  className={cn(
                    "size-5 flex items-center justify-center rounded-full transition-all duration-200",
                    selectedCardId === card.id
                      ? "bg-green-500 border-2 border-green-500"
                      : "bg-transparent border-2 border-black"
                  )}
                >
                  {selectedCardId && (
                    <Check
                      className={cn(
                        "size-3 transition-all duration-200",
                        selectedCardId === card.id ? "text-white" : "text-black"
                      )}
                      strokeWidth={3}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex items-center gap-x-2 text-sm opacity-45">
          Billetera digital (Apple Pay/Google Pay)
          <button className="size-5 flex items-center justify-center rounded-full bg-gray-200">
            <IoIosArrowDown className="size-4 text-black" strokeWidth={12} />
          </button>
        </div>

        <div className="flex items-center gap-x-2 text-sm mt-2 opacity-45">
          En efectivo (al recojo)
          <button className="size-5 flex items-center justify-center rounded-full bg-gray-200">
            <IoIosArrowDown className="size-4 text-black" strokeWidth={12} />
          </button>
        </div> */}
      </div>

      <div className="w-full flex justify-center">
        <Button
          className={cn(
            "bg-sky-500 hover:bg-sky-600 transition-all duration-200",
            (!selectedCardId || loading) && "opacity-50 cursor-not-allowed"
          )}
          onClick={handlePayment}
          disabled={!selectedCardId || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando pago...
            </>
          ) : (
            "Pagar"
          )}
        </Button>
      </div>

      {/* Diálogo de éxito componentizado */}
      <PaymentSuccess
        isOpen={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
      />
    </div>
  );
}
