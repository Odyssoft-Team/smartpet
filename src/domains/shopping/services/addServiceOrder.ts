import { supabase } from "@/lib/supabaseClient";

export interface ServiceOrder {
  user_id: string;
  pet_id: number;
  variant_id: number;
  card_id: string;
  scheduled_date: string;
  scheduled_time: string;
  total: number;
  payment_status: string;
  status: string;
  notes: string;
}

export const addServiceOrder = async (serviceOrder: ServiceOrder) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No hay usuario autenticado");

    const { data, error } = await supabase
      .from("service_orders")
      .insert([serviceOrder])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error agregando la orden:", error);
    return null;
  }
};
