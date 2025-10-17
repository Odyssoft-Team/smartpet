import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useState } from "react";

export function useProfiles() {
  const [loading, setLoading] = useState(false);

  // GET - Obtener todos los perfiles
  const getProfiles = async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*");

    setLoading(false);

    if (error) {
      toast.error("Error al obtener perfiles", { description: error.message });
      return null;
    }

    return profiles;
  };

  // GET - Obtener perfil por ID
  const getProfileById = async (id: string) => {
    setLoading(true);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setLoading(false);

    if (error) {
      toast.error("Error al obtener perfil", { description: error.message });
      return null;
    }

    return profile;
  };

  // POST - Crear nuevo perfil
  const createProfile = async (profileData: {
    full_name: string;
    email: string;
    // otros campos...
  }) => {
    setLoading(true);
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error("Error al crear perfil", { description: error.message });
      return null;
    }

    toast.success("Perfil creado exitosamente");
    return profile;
  };

  // PUT - Actualizar perfil
  const updateProfile = async (
    id: string,
    updates: Partial<{
      full_name: string;
      // otros campos actualizables...
    }>
  ) => {
    setLoading(true);
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error("Error al actualizar perfil", { description: error.message });
      return null;
    }

    toast.success("Perfil actualizado exitosamente");
    return profile;
  };

  // DELETE - Eliminar perfil
  const deleteProfile = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    setLoading(false);

    if (error) {
      toast.error("Error al eliminar perfil", { description: error.message });
      return false;
    }

    toast.success("Perfil eliminado exitosamente");
    return true;
  };

  return {
    getProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    loading,
  };
}
