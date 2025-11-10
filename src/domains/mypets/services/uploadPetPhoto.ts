import { supabase } from "@/lib/supabaseClient";

export async function uploadPetPhoto(file: File, petName?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No hay usuario autenticado");

  const safeName = petName || "mascota";
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${safeName}-${Date.now()}.${fileExt}`;
  const filePath = `pets/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("pets")
    .upload(filePath, file, { upsert: true, cacheControl: "3600" });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("pets")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
