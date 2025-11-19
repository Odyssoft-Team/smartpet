import { useRef, useState, useCallback } from "react";
import { IoCamera } from "react-icons/io5";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { useProfiles } from "../services/servicesProfile";

interface AvatarUploaderProps {
  defaultImage: string;
  avatarUrl?: string;
  uploadFn?: (file: File) => Promise<string>;
  onAvatarChange: (url: string) => void;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

// 👉 Helper para recortar la imagen
async function cropImage(
  imageSrc: string,
  cropPixels: CroppedAreaPixels
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Error generando blob");
      resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
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

  // 🌟 NUEVO: estados para recorte
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<CroppedAreaPixels | null>(
    null
  );

  const handleImageClick = () => {
    if (isUploading) return;

    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  // 🌟 NUEVO: selección de archivo → abrir recortador
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error("No se pudo seleccionar la imagen");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.warning("Selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("La imagen debe ser menor a 5MB");
      return;
    }

    setRawFile(file);
    setShowCropper(true); // mostrar modal de recorte
  };

  const imageURL = rawFile ? URL.createObjectURL(rawFile) : "";

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedPixels(croppedAreaPixels);
    },
    []
  );

  // 🌟 NUEVO: confirmar recorte → subir a Supabase o servicio personalizado
  const handleConfirmCrop = async () => {
    if (!rawFile || !croppedPixels) return;

    setShowCropper(false);
    setIsUploading(true);

    try {
      toast.loading("Procesando imagen...", { id: "upload" });

      // 1️⃣ Recortar archivo
      const croppedFile = await cropImage(imageURL, croppedPixels);

      // 2️⃣ Subir por uploadFn o profile.service
      let imageUrl: string | undefined | null;

      if (uploadFn) {
        imageUrl = await uploadFn(croppedFile);
      } else {
        const updated = await updateProfile({ avatarFile: croppedFile });
        imageUrl = updated?.avatar_url ?? null;
      }

      if (!imageUrl) {
        throw new Error("No se obtuvo URL");
      }

      onAvatarChange(imageUrl);
      toast.success("Imagen actualizada", { id: "upload" });
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la imagen", { id: "upload" });
      onAvatarChange(defaultImage);
    } finally {
      setIsUploading(false);
      setRawFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🌟 MODAL DE RECORTE */}
      {showCropper && rawFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-md shadow-xl">
            <div className="relative w-full h-72 bg-gray-200 rounded-xl overflow-hidden">
              <Cropper
                image={imageURL}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setShowCropper(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmCrop}>Recortar</Button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR */}
      <div
        className={`relative group shadow-xl size-[120px] rounded-full bg-transparent cursor-pointer overflow-hidden ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleImageClick}
      >
        <img
          src={avatarUrl || defaultImage}
          alt="Foto"
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75 rounded-full"
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="size-8 text-white animate-spin" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-full transition-all duration-300">
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
