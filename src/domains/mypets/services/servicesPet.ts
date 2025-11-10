import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { Pet } from "../utils/Pet";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  // 🐾 Obtener mascotas
  const getPets = async (): Promise<Pet[] | null> => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Usuario no autenticado");
        return null;
      }

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setPets(data || []);
      return data;
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🐶 Agregar mascota
  const addPet = async (
    newPet: Omit<Pet, "id" | "user_id"> & { photoFile?: File }
  ) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const formattedPet: Omit<Pet, "id"> = {
        ...newPet,
        birth_date: newPet.birth_date
          ? new Date(newPet.birth_date).toISOString().split("T")[0]
          : null,
        user_id: user.id,
        photo_url: newPet.photo_url || null,
      };

      if (newPet.photoFile) {
        const photoUrl = await uploadPetPhoto(newPet.photoFile, newPet.name);
        formattedPet.photo_url = photoUrl;
      }

      const { data, error } = await supabase
        .from("pets")
        .insert([formattedPet])
        .select()
        .single();

      if (error) throw error;

      setPets((prev) => [...prev, data]);
      toast.success("Mascota agregada correctamente 🎉");
      return data;
    } catch (error) {
      console.error("Error agregando la mascota:", error);
      toast.error("No se pudo agregar la mascota");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Actualizar mascota
  const updatePet = async (id: string, updatedData: Partial<Pet>) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("pets")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // 🔄 Actualiza el estado local
      setPets((prev) =>
        prev.map((pet) => (pet.id === id ? { ...pet, ...data } : pet))
      );

      toast.success("Mascota actualizada correctamente ✅");
      return data as Pet;
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      toast.error("No se pudo actualizar la mascota");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 📸 Subir foto de mascota
  async function uploadPetPhoto(file: File, petName?: string) {
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

  // 🗑️ Eliminar mascota
  const deletePet = async (petId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error eliminando mascota:", error);
      toast.error("No se pudo eliminar la mascota");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    pets,
    loading,
    getPets,
    addPet,
    updatePet,
    uploadPetPhoto,
    deletePet,
  };
}
