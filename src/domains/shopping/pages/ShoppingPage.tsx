import { FaChevronLeft } from "react-icons/fa";
import { useServiceStore } from "@/store/service.store";
import { PiDogFill } from "react-icons/pi";
import { CiClock2 } from "react-icons/ci";
import { useCardsStore } from "@/store/card.store";
import MaskedCard from "@/domains/profile/components/MaskedCard";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiPencil } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { PaymentSuccess } from "../components/DialogSucessPay";
import { useDetailStore } from "@/store/detail";

export default function ShoppingPage() {
  // const { selectedService, setSelectedService } = useServiceStore();
  const { selectedService } = useServiceStore();
  const { selectedService: selectedServiceBeta, listAdditionalServices } =
    useDetailStore();
  const navigate = useNavigate();

  const hasService = selectedService && Object.keys(selectedService).length > 0;

  // const service = selectedService?.type_service;
  // const extras = selectedService?.additional_services ?? [];

  // 🧮 Calcular total
  // const basePrice = parseFloat(selectedService?.price ?? "0");
  // const extrasTotal = extras.reduce(
  //   (acc, add) => acc + parseFloat(add.price ?? "0"),
  //   0
  // );
  // const total = (basePrice + extrasTotal).toFixed(2);

  const { listCards } = useCardsStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<boolean>(false);
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

    // Simular proceso de pago de 3 segundos
    setTimeout(() => {
      setLoading(false);
      setShowSuccessDialog(true);

      // Limpiar el estado global después de mostrar el diálogo
      setTimeout(() => {
        // setSelectedService(null);
        setShowSuccessDialog(false);
        navigate("/");
      }, 5500);
    }, 3000);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // setSelectedService(null);
    navigate("/");
  };

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
                Fidel <PiDogFill className="size-5" />
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"></div>
                <Link
                  to={"/services/grooming/2"}
                  className="size-5 flex items-center justify-center rounded-full bg-gray-200"
                >
                  <HiPencil className="size-3 text-sky-600" />
                </Link>
              </div>
            </div>

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

            <div className="w-full flex justify-between items-center">
              {listAdditionalServices.map((item) => {
                return (
                  <div className="w-full flex justify-between items-center">
                    <div className="w-fit">
                      <h3 className="flex items-center gap-x-2 font-medium -mb-2">
                        {item.name}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {item.description}
                      </span>
                    </div>
                    <h3 className="w-fit font-bold text-sm text-[#D86C00]">
                      S/.{item?.price}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* <div>
              <h3 className="text-sky-500">Adicionales+</h3>
              {extras.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {extras.map((add, i) => (
                    <li key={i} className="w-full flex justify-between">
                      <p className="text-sm flex gap-x-2 text-gray-400">
                        ● <span>{add.name}</span>
                      </p>
                      <span className="text-sm font-bold text-sky-500">
                        S/.{add.price}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Sin adicionales</p>
              )}
            </div> */}

            <div className="w-full h-[1px] bg-gray-300 mt-2" />

            <div className="w-full flex justify-end">
              {/* <h3 className="w-fit font-bold text-green-500 tracking-wider">
                Total: S/.{total}
              </h3> */}
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

        <div className="flex items-center gap-x-2 text-sm">
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
                  <Check
                    className={cn(
                      "size-3 transition-all duration-200",
                      selectedCardId === card.id ? "text-white" : "text-black"
                    )}
                    strokeWidth={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-x-2 text-sm opacity-45">
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
        </div>
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
