import { supabase } from "@/lib/supabaseClient";
import type { Pet } from "./getPetsByUser";

export const updatePet = async (id: number, updatedData: Partial<Pet>) => {
  try {
    const { data, error } = await supabase
      .from("pets")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as Pet;
  } catch (error) {
    console.error("Error actualizando mascota:", error);
    return null;
  }
};
