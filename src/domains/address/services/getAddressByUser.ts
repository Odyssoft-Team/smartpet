import { supabase } from "@/lib/supabaseClient";

export interface AddressByUser {
  id: number;
  alias: string;
  address: string;
  reference: string;
  district_id: number;
  is_default: boolean;
}

export const getAddressByUser = async (
  user_id: string
): Promise<AddressByUser[] | null> => {
  try {
    const { data, error } = await supabase
      .from("user_addresses")
      .select("id, alias, address, reference, district_id, is_default")
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error obteniendo direcciones:", error);
    return null;
  }
};
