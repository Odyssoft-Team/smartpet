import { supabase } from "@/lib/supabaseClient";
import type { VaccineByPet } from "./getVaccinesByPet";

export const addVaccine = async (
  vaccine: Omit<VaccineByPet, "id" | "created_at">
): Promise<VaccineByPet | null> => {
  try {
    const { data, error } = await supabase
      .from("vaccines")
      .insert([vaccine])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error registrando vacuna:", error);
    return null;
  }
};
