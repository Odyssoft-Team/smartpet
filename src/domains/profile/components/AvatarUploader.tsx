import { useRef, useState } from "react";
import { IoCamera } from "react-icons/io5";
import { toast } from "sonner";
import { useProfiles } from "../services/servicesProfile";
import { Loader2 } from "lucide-react";

interface AvatarUploaderProps {
  defaultImage: string;
  avatarUrl?: string;
  uploadFn?: (file: File) => Promise<string>;
  onAvatarChange: (url: string) => void;
}

export const AvatarUploader = ({
  defaultImage,
  avatarUrl,
  onAvatarChange,
  uploadFn,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateProfile } = useProfiles();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    if (isUploading) return;

    // iPhone fix — reiniciar input para permitir re-seleccionar la misma imagen
    if (fileInputRef.current) fileInputRef.current.value = "";

    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // ⚠ FIX para iPhone: si Safari NO entrega archivo, aplicar fallback
    if (!file) {
      toast.error("En estos momentos no se puede subir foto");
      onAvatarChange(defaultImage);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.warning("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("La imagen debe ser menor a 5MB");
      return;
    }

    setIsUploading(true);

    try {
      toast.loading("Subiendo imagen...", { id: "upload" });

      let imageUrl: string | null = null;

      if (uploadFn) {
        imageUrl = await uploadFn(file);
      } else {
        const updated = await updateProfile({ avatarFile: file });
        imageUrl = updated?.avatar_url ?? null;
      }

      if (!imageUrl) {
        toast.error("En estos momentos no se puede subir foto", {
          id: "upload",
        });
        onAvatarChange(defaultImage); // Fallback default image
        return;
      }

      onAvatarChange(imageUrl);
      toast.success("Imagen actualizada ✅", { id: "upload" });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("En estos momentos no se puede subir foto", {
        id: "upload",
      });
      onAvatarChange(defaultImage); // Fallback en caso de error
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative group shadow-xl size-[120px] rounded-full bg-transparent cursor-pointer overflow-hidden ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleImageClick}
      >
        <img
          src={avatarUrl || defaultImage}
          alt="Foto"
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75 rounded-xl"
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <Loader2 className="size-8 text-white animate-spin" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-all duration-300">
            <IoCamera className="size-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <span
        className={`text-[10px] mt-2 ${
          isUploading ? "text-blue-500" : "text-gray-500"
        }`}
      >
        {isUploading ? "Subiendo imagen..." : "Toca para añadir una foto"}
      </span>
    </div>
  );
};
