import { supabase } from "@/lib/supabaseClient";

export interface Breed {
  id: number;
  name: string;
  species_id: number;
}

export const getAllBreeds = async (): Promise<Breed[] | null> => {
  try {
    const { data, error } = await supabase
      .from("breed_catalog")
      .select("id, name, species_id")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error obteniendo razas:", error);
    return null;
  }
};
