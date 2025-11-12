import { supabase } from "@/lib/supabaseClient";

export interface AvailableDates {
  id: number;
  date: string;
  max_capacity: number;
  used_capacity: number;
}

export const getAvailableDatesByService = async (
  service_id: number
): Promise<AvailableDates[] | null> => {
  try {
    const { data, error } = await supabase
      .from("service_capacity")
      .select("id, date, max_capacity, used_capacity")
      .eq("service_id", service_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error obteniendo las mascotas:", error);
    return null;
  }
};
