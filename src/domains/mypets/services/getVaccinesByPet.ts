import { supabase } from "@/lib/supabaseClient";

export interface VaccineByPet {
  id: string;
  pet_id: string;
  applied_at: Date;
  next_dose_at?: Date;
  notes?: string;
  vaccine_catalog_id?: number;
  created_at: string;
}

export const getVaccinesByPet = async (
  petId: string
): Promise<VaccineByPet[] | null> => {
  try {
    const { data, error } = await supabase
      .from("vaccines")
      .select("*")
      .eq("pet_id", petId)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error obteniendo vacunas:", error);
    return null;
  }
};
