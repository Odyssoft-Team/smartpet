import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import type { Cards } from "../utils/Card";

interface CardEditFormProps {
  cardData: Cards;
  onEdit: (updatedCard: Cards) => Promise<void> | void;
  onClose: () => void;
}

const CardEditForm = ({ cardData, onEdit, onClose }: CardEditFormProps) => {
  const [formData, setFormData] = useState<Cards>({ ...cardData });
  const [loading, setLoading] = useState(false);

  // ======= FORMATEADORES =======
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
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

  const validateExpiryDate = (value: string): boolean => {
    if (!value || value.length !== 5) return false;
    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth))
      return false;
    return true;
  };

  // ======= HANDLERS =======
  const handleChange = (
    field: keyof Cards,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      await onEdit(formData);
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======= VALIDACIÓN =======
  const expiryString = `${formData.expiry_month?.toString().padStart(2, "0") ?? ""}/${
    formData.expiry_year?.toString().slice(-2) ?? ""
  }`;

  const isFormValid = useMemo(() => {
    const cardNumber = (formData.card_number ?? "").replace(/\s/g, "");
    return (
      formData.label.trim() !== "" &&
      formData.card_holder_name.trim() !== "" &&
      cardNumber.length >= 15 &&
      validateExpiryDate(expiryString)
    );
  }, [formData, expiryString]);

  // ======= UI =======
  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Editar Tarjeta</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <IoClose className="size-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Nombre de Etiqueta
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D86C00]"
            maxLength={30}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Número de Tarjeta
          </label>
          <input
            type="text"
            value={formData.card_number ?? ""}
            onChange={(e) =>
              handleChange("card_number", formatCardNumber(e.target.value))
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D86C00]"
            maxLength={19}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Titular de la Tarjeta
          </label>
          <input
            type="text"
            value={formData.card_holder_name}
            onChange={(e) =>
              handleChange("card_holder_name", e.target.value.toUpperCase())
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D86C00] uppercase"
            maxLength={50}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">MM/AA</label>
            <input
              type="text"
              value={expiryString}
              onChange={(e) => {
                const formatted = formatExpiryDate(e.target.value);
                const [month, year] = formatted.split("/");
                handleChange("expiry_month", parseInt(month) || 0);
                handleChange("expiry_year", 2000 + (parseInt(year) || 0));
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D86C00]"
              placeholder="MM/AA"
              maxLength={5}
              disabled={loading}
            />
            {expiryString.length === 5 && !validateExpiryDate(expiryString) && (
              <p className="text-sm text-red-500 mt-1">
                Fecha de expiración inválida
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">CVV</label>
            <input
              type="password"
              value={(formData as any).cvv ?? ""}
              onChange={(e) =>
                handleChange(
                  "cvv" as any,
                  e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                )
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D86C00]"
              placeholder="123"
              maxLength={4}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#D86C00] hover:bg-[#b35900] text-white"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar Tarjeta"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardEditForm;
