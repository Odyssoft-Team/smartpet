import { supabase } from "@/lib/supabaseClient";

export interface Vaccine {
  id: string;
  name: string;
}

export const getVaccines = async (): Promise<Vaccine[] | null> => {
  try {
    const { data, error } = await supabase.from("vaccine_catalog").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error obteniendo vacunas:", error);
    return null;
  }
};
