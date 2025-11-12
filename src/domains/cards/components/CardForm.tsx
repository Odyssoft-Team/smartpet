import { useState } from "react";
import {
  detectCardBrand,
  getCardInfo,
  formatCardNumber,
  isValidCardLength,
} from "../utils/cardDetection";

interface CardFormProps {
  onSubmit: (data: {
    label: string;
    card_holder_name: string;
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function CardForm({ onSubmit, isLoading = false }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [label, setLabel] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = detectCardBrand(cardNumber);
  const cardInfo = getCardInfo(brand);

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (/^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!label.trim()) {
      newErrors.label = "La etiqueta es requerida";
    }

    if (!cardHolder.trim()) {
      newErrors.cardHolder = "El nombre del titular es requerido";
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = "El número de tarjeta es requerido";
    } else if (!isValidCardLength(cardNumber)) {
      newErrors.cardNumber = `Número de tarjeta inválido para ${cardInfo.displayName}`;
    }

    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      newErrors.expiryMonth = "Mes inválido";
    }

    if (!expiryYear || parseInt(expiryYear) < new Date().getFullYear()) {
      newErrors.expiryYear = "Año inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        label,
        card_holder_name: cardHolder,
        card_number: cardNumber.replace(/\s/g, ""),
        expiry_month: parseInt(expiryMonth),
        expiry_year: parseInt(expiryYear),
        is_default: isDefault,
      });
    } catch (error) {
      console.error("Error al guardar tarjeta:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vista previa de tarjeta */}
      {cardNumber && (
        <div
          className={`${cardInfo.color} rounded-lg p-6 text-white shadow-lg`}
        >
          <div className="flex justify-between items-start mb-8">
            <div className="text-3xl">{cardInfo.logo}</div>
            <span className="text-xs font-bold bg-white bg-opacity-30 px-3 py-1 rounded">
              {cardInfo.displayName}
            </span>
          </div>
          <div className="mb-6">
            <p className="text-xs text-white text-opacity-80 mb-2">Número</p>
            <p className="text-lg font-mono tracking-widest">{cardNumber}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-white text-opacity-80">Titular</p>
              <p className="text-sm font-semibold">
                {cardHolder || "NOMBRE TITULAR"}
              </p>
            </div>
            <div>
              <p className="text-xs text-white text-opacity-80">Vence</p>
              <p className="text-sm font-mono">
                {expiryMonth || "--"}/{expiryYear || "--"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Etiqueta */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Etiqueta (Casa, Oficina, etc.)
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (errors.label) setErrors({ ...errors, label: "" });
          }}
          placeholder="Ej: Mi Visa"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={isLoading}
        />
        {errors.label && (
          <p className="text-red-500 text-sm mt-1">{errors.label}</p>
        )}
      </div>

      {/* Titular */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre del Titular
        </label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => {
            setCardHolder(e.target.value.toUpperCase());
            if (errors.cardHolder) setErrors({ ...errors, cardHolder: "" });
          }}
          placeholder="Ej: JUAN PEREZ"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={isLoading}
        />
        {errors.cardHolder && (
          <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
        )}
      </div>

      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Número de Tarjeta
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => {
            handleCardNumberChange(e.target.value);
            if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
          }}
          placeholder="4000 0000 0000 0000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono"
          disabled={isLoading}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiración */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mes</label>
          <input
            type="number"
            value={expiryMonth}
            onChange={(e) => {
              setExpiryMonth(e.target.value);
              if (errors.expiryMonth) setErrors({ ...errors, expiryMonth: "" });
            }}
            placeholder="MM"
            min="1"
            max="12"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            disabled={isLoading}
          />
          {errors.expiryMonth && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Año</label>
          <input
            type="number"
            value={expiryYear}
            onChange={(e) => {
              setExpiryYear(e.target.value);
              if (errors.expiryYear) setErrors({ ...errors, expiryYear: "" });
            }}
            placeholder="YYYY"
            min={new Date().getFullYear()}
            max="2099"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            disabled={isLoading}
          />
          {errors.expiryYear && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
          )}
        </div>
      </div>

      {/* Predeterminada */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          disabled={isLoading}
          className="w-4 h-4"
        />
        <label htmlFor="isDefault" className="text-sm">
          Establecer como predeterminada
        </label>
      </div>

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? "Guardando..." : "Guardar Tarjeta"}
      </button>
    </form>
  );
}
