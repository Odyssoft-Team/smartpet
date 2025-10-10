import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

const CardEditForm = ({
  label,
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  onLabelChange,
  onCardNumberChange,
  onCardHolderChange,
  onExpiryDateChange,
  onCvvChange,
  onSave,
  onClose,
}: {
  label: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  onLabelChange: (label: string) => void;
  onCardNumberChange: (cardNumber: string) => void;
  onCardHolderChange: (cardHolder: string) => void;
  onExpiryDateChange: (expiryDate: string) => void;
  onCvvChange: (cvv: string) => void;
  onSave: () => void;
  onClose: () => void;
}) => {
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = cleaned.match(/\d{1,4}/g);
    return matches ? matches.join(" ") : "";
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    onCardNumberChange(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    onExpiryDateChange(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    onCvvChange(cleaned);
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    onCardHolderChange(value);
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Editar Tarjeta</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose className="size-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nombre de Etiqueta
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ej: Tarjeta Principal"
            maxLength={30}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Número de Tarjeta
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Titular de la Tarjeta
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={handleCardHolderChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent uppercase"
            placeholder="JUAN PEREZ"
            maxLength={50}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Fecha de Expiración
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
              placeholder="MM/AA"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CVV</label>
            <input
              type="password"
              value={cvv}
              onChange={handleCvvChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 bg-[#D86C00] hover:bg-[#b35900] text-white"
            disabled={
              !label || !cardNumber || !cardHolder || !expiryDate || !cvv
            }
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardEditForm;
