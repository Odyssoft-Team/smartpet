import { supabase } from "@/lib/supabaseClient";

export interface Coupons {
  id: string;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  max_discount: number;
  total_available: number;
  used_count: number;
  applies_to: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}

export const getCoupons = async (): Promise<Coupons[] | null> => {
  try {
    const { data, error } = await supabase.from("coupons").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error obteniendo cupones:", error);
    return null;
  }
};
