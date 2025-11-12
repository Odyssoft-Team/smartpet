import { detectCardBrand, getCardInfo } from "../utils/cardDetection";
import type { Card } from "../services/cardService";

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
      className={`${cardInfo.color} rounded-lg p-6 text-white shadow-lg transition-transform hover:shadow-xl`}
    >
      {/* Etiqueta y estado */}
      {(card.label || card.is_default) && (
        <div className="mt-4 pt-4 flex justify-between items-center">
          <span className="text-sm">{card.label}</span>
          {card.is_default && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              Predeterminada
            </span>
          )}
        </div>
      )}
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
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl">{cardInfo.logo}</div>
        <span className="text-xs font-bold bg-white bg-opacity-30 px-3 py-1 rounded">
          {cardInfo.displayName}
        </span>
      </div>

      {/* Botón eliminar */}
      {showDeleteButton && onDelete && (
        <button
          onClick={() => onDelete(card.id)}
          className="w-full mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm py-2 rounded transition-all"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
