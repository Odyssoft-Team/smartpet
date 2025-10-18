import { useRef } from "react";
import { IoCamera } from "react-icons/io5";
import { toast } from "sonner";
import user_demo from "@/assets/profile/user-profile.jpg"; // reemplaza si tu ruta es distinta
import { useProfiles } from "../services/servicesProfile";

interface AvatarUploaderProps {
  avatarUrl?: string | null;
  onAvatarChange: (newUrl: string) => void;
}

export const AvatarUploader = ({
  avatarUrl,
  onAvatarChange,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateProfile } = useProfiles();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 🧩 Validaciones básicas
    if (!file.type.startsWith("image/")) {
      toast.warning("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      toast.loading("Actualizando imagen de perfil...", { id: "upload" });

      const updatedProfile = await updateProfile({ avatarFile: file });

      if (!updatedProfile || !updatedProfile.avatar_url) {
        toast.error("Error al actualizar la imagen de perfil", {
          id: "upload",
        });
        return;
      }

      onAvatarChange(updatedProfile.avatar_url);

      toast.success("Imagen de perfil actualizada correctamente", {
        id: "upload",
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Ocurrió un error inesperado al actualizar la imagen", {
        id: "upload",
      });
    } finally {
      // Limpia el input (permite volver a seleccionar la misma imagen si se desea)
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative group shadow-xl size-[160px] rounded-xl cursor-pointer overflow-hidden"
        onClick={handleImageClick}
      >
        <img
          src={avatarUrl || user_demo}
          alt="Foto de perfil"
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-all duration-300">
          <IoCamera className="size-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <span className="text-[10px] text-gray-500 mt-2">
        Toca para añadir una foto de perfil
      </span>
    </div>
  );
};
