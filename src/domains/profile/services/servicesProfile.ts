// services/servicesProfile.ts
import { supabase } from "../../../lib/supabaseClient";
import { toast } from "sonner";
import { useState } from "react";

export function useProfiles() {
  const [loading, setLoading] = useState(false);

  const getCurrentUserProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      toast.error("No se pudo obtener el usuario autenticado");
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error al obtener el perfil del usuario");
      return null;
    }

    return profile;
  };

  const updateProfile = async (updates: {
    full_name?: string;
    email?: string;
    phone?: string;
    avatarFile?: File;
    label_address?: string;
    address?: string;
  }) => {
    try {
      setLoading(true);

      // 1️⃣ Obtener usuario autenticado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Usuario no autenticado");

      let avatar_url: string | undefined;

      // 2️⃣ Subir imagen al bucket si se envió un archivo nuevo
      if (updates.avatarFile) {
        const file = updates.avatarFile;
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        console.log("Subiendo imagen:", filePath);

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true, cacheControl: "3600" });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatar_url = urlData.publicUrl;
      }

      // 3️⃣ Construir objeto de actualización sin perder campos vacíos
      const updateData: Partial<{
        full_name: string;
        email: string;
        phone: string;
        avatar_url: string;
        label_address: string;
        address: string;
      }> = {};

      if (updates.full_name !== undefined)
        updateData.full_name = updates.full_name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (avatar_url) updateData.avatar_url = avatar_url;
      if (updates.label_address !== undefined)
        updateData.label_address = updates.label_address;
      if (updates.address !== undefined) updateData.address = updates.address;

      // 4️⃣ Si no hay cambios, evitar llamada innecesaria
      if (Object.keys(updateData).length === 0) {
        toast.info("No hay cambios para actualizar");
        return null;
      }

      console.log("Actualizando perfil con:", updateData);

      // 5️⃣ Actualizar en Supabase
      const { data: profile, error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success("Perfil actualizado exitosamente");
      return profile;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.error("Error al actualizar el perfil");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCurrentUserProfile,
    updateProfile,
    loading,
  };
}
