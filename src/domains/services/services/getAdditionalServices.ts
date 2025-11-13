import { supabase } from "@/lib/supabaseClient";

export interface AdditionalServices {
  id: number;
  service_id: number;
  name: string;
  price: number;
  is_active: boolean;
  description: string;
  category: string;
}

export const getAdditionalServices = async (
  service_id: number
): Promise<AdditionalServices[] | null> => {
  try {
    const { data, error } = await supabase
      .from("service_options")
      .select("*")
      .eq("service_id", service_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error obteniendo servicios adicionales:", error);
    return null;
  }
};
