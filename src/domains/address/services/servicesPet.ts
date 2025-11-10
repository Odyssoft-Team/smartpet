import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { Pet } from "@/domains/mypets/services/getPetsByUser";
import { uploadPetPhoto } from "@/domains/mypets/services/uploadPetPhoto";

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

      if (!user) throw new Error("No hay usuario autenticado");

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

  return { pets, loading, getPets, addPet };
}
