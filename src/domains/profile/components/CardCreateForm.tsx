import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Cards } from "../utils/Card";

interface CardCreateFormProps {
  onSave: (
    newCard: Omit<Cards, "id" | "created_at" | "updated_at">
  ) => Promise<void> | void;
  onClose: () => void;
}

const CardCreateForm = ({ onSave, onClose }: CardCreateFormProps) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    label: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // 🔸 Estado de carga
  const [loading, setLoading] = useState(false);

  // 🔸 Handlers y formateo
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) =>
    value
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "")
      .match(/\d{1,4}/g)
      ?.join(" ") || "";

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return cleaned.length >= 3
      ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      : cleaned;
  };

  const validateExpiryDate = (date: string): boolean => {
    if (date.length !== 5) return false;
    const [monthStr, yearStr] = date.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    if (month < 1 || month > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    return !(
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    );
  };

  const isCardNumberValid = () => {
    const cleaned = formData.cardNumber.replace(/\s/g, "");
    return cleaned.length >= 13 && cleaned.length <= 19;
  };

  const isFormValid =
    formData.label.trim() &&
    isCardNumberValid() &&
    formData.cardHolder.trim() &&
    validateExpiryDate(formData.expiryDate) &&
    formData.cvv.length >= 3;

  const handleSave = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const [monthStr, yearStr] = formData.expiryDate.split("/");
      const cardData = {
        label: formData.label.trim(),
        card_holder_name: formData.cardHolder.trim(),
        card_number: formData.cardNumber.replace(/\s/g, ""),
        expiry_month: parseInt(monthStr, 10),
        expiry_year: 2000 + parseInt(yearStr, 10),
        brand: "unknown" as const,
        is_default: false,
      };

      await onSave(cardData);
    } catch (err) {
      console.error("Error al guardar la tarjeta:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Agregar Tarjeta</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          disabled={loading}
        >
          <IoClose className="size-6" />
        </button>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <InputField
          label="Nombre de Etiqueta"
          placeholder="Ej: Tarjeta Principal"
          value={formData.label}
          onChange={(e) => handleChange("label", e.target.value)}
          disabled={loading}
        />

        <InputField
          label="Número de Tarjeta"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={(e) =>
            handleChange("cardNumber", formatCardNumber(e.target.value))
          }
          maxLength={19}
          disabled={loading}
          error={
            formData.cardNumber && !isCardNumberValid()
              ? "Número de tarjeta inválido"
              : undefined
          }
        />

        <InputField
          label="Titular de la Tarjeta"
          placeholder="JUAN PEREZ"
          value={formData.cardHolder}
          onChange={(e) =>
            handleChange(
              "cardHolder",
              e.target.value
                .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
                .toUpperCase()
            )
          }
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Fecha de Expiración"
            placeholder="MM/AA"
            value={formData.expiryDate}
            onChange={(e) =>
              handleChange("expiryDate", formatExpiryDate(e.target.value))
            }
            maxLength={5}
            disabled={loading}
            error={
              formData.expiryDate.length === 5 &&
              !validateExpiryDate(formData.expiryDate)
                ? "Fecha inválida"
                : undefined
            }
          />

          <InputField
            label="CVV"
            placeholder="123"
            type="password"
            value={formData.cvv}
            onChange={(e) =>
              handleChange(
                "cvv",
                e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
              )
            }
            maxLength={4}
            disabled={loading}
          />
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
                Guardando...
              </>
            ) : (
              "Guardar Tarjeta"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 🔸 Componente auxiliar para inputs
const InputField = ({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default CardCreateForm;
