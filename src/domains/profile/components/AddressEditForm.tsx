import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AddressEditFormProps {
  addressData: {
    label_address?: string;
    address?: string;
  };
  onSave: (updated: {
    label_address: string;
    address: string;
  }) => Promise<void> | void;
  onClose: () => void;
}

const AddressEditForm = ({
  addressData,
  onSave,
  onClose,
}: AddressEditFormProps) => {
  const [formData, setFormData] = useState({
    label_address: addressData.label_address || "",
    address: addressData.address || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.label_address.trim() || !formData.address.trim()) return;

    try {
      setLoading(true);
      await onSave({
        label_address: formData.label_address.trim(),
        address: formData.address.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.label_address.trim().length > 0 &&
    formData.address.trim().length > 0;

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Editar Dirección
        </h3>
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
          placeholder="Ej: Casa, Oficina"
          value={formData.label_address}
          onChange={(e) => handleChange("label_address", e.target.value)}
          disabled={loading}
        />

        <InputField
          label="Dirección"
          placeholder="Ingresa tu dirección completa"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          disabled={loading}
        />

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
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Subcomponente reutilizable
const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
    />
  </div>
);

export default AddressEditForm;
