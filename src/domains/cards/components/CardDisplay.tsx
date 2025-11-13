import { detectCardBrand, getCardInfo } from "../utils/cardDetection";
import type { Card } from "../services/cardService";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardDisplayProps {
  card: Card;
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
}

export default function CardDisplay({
  card,
  onDelete,
  showDeleteButton = true,
}: CardDisplayProps) {
  const brand = detectCardBrand(card.card_number);
  const cardInfo = getCardInfo(brand);
  const last4 = card.card_number.slice(-4);
  const maskedNumber = `**** **** **** ${last4}`;

  return (
    <div
      className={`${cardInfo.color} rounded-lg p-4 text-white shadow-lg transition-transform hover:shadow-xl`}
    >
      <div className="flex justify-between items-center mb-6">
        {/* Etiqueta y estado */}
        {(card.label || card.is_default) && (
          <div className="flex justify-between items-center">
            <span className="text-sm">{card.label}</span>
            {card.is_default && (
                <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded ml-3">
                  Predeterminada
                </span>
            )}
          </div>
        )}

        {/* Menú desplegable con 3 puntos */}
        {showDeleteButton && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all">
                <MoreVertical className="size-4 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(card.id)}
                className="text-red-500 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Número de tarjeta */}
      <div className="mb-4">
        <p className="text-xs text-white text-opacity-80 mb-2 hidden">Número</p>
        <p className="text-lg font-mono tracking-widest">{maskedNumber}</p>
      </div>

      {/* Titular y expiración */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-white text-opacity-80 hidden">Titular</p>
          <p className="text-sm font-semibold">{card.card_holder_name}</p>
        </div>
        <div>
          <p className="text-xs text-white text-opacity-80 hidden">Vence</p>
          <p className="text-sm font-mono">
            {String(card.expiry_month).padStart(2, "0")}/{card.expiry_year}
          </p>
        </div>
      </div>

      {/* Header con logo y marca */}
      <div className="flex justify-between items-start mt-2">
        {/* <div className="text-3xl opacity-0">{cardInfo.logo}</div> */}
        <div className="text-3xl opacity-0">{" "}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-black bg-opacity-30 px-3 py-1 rounded">
            {cardInfo.displayName}
          </span>
        </div>
      </div>

      {/* Botón eliminar antiguo - removido */}
    </div>
  );
}
