import { supabase } from "@/lib/supabaseClient";

export interface Species {
  id: number;
  name: string;
}

export const getAllSpecies = async (): Promise<Species[] | null> => {
  try {
    const { data, error } = await supabase
      .from("species_catalog")
      .select("id, name")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error obteniendo especies:", error);
    return null;
  }
};
