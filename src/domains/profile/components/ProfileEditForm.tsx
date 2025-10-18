import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useProfiles } from "../services/servicesProfile";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ListProfile } from "../utils/Profile";

interface ProfileEditFormProps {
  profileData: ListProfile;
  onEdit: (data: ListProfile) => Promise<void> | void;
  onClose: () => void;
}

const ProfileEditForm = ({
  profileData,
  onEdit,
  onClose,
}: ProfileEditFormProps) => {
  const { updateProfile, loading } = useProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado local editable (evita mutar directamente los datos del padre)
  const [formData, setFormData] = useState<ListProfile>(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleChange = (field: keyof ListProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedProfile = await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });

      if (updatedProfile) {
        await onEdit(formData); // notifica al padre con los nuevos datos
        toast.success("Perfil actualizado correctamente");
        onClose();
      }
    } catch {
      toast.error("Error", {
        description: "Error inesperado al guardar los cambios",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Editar Perfil</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isSubmitting}
        >
          <IoClose className="size-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nombre completo o alias
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ingresa tu nombre completo"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ingresa tu correo"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ingresa tu teléfono"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#D86C00] hover:bg-[#b35900] text-white disabled:opacity-50 flex items-center justify-center"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <span className="flex items-center gap-x-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
