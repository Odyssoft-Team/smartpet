import { supabase } from "@/lib/supabaseClient";

export const getOrderServices = async () => {
  const { data: services, error } = await supabase
    .from("service_orders")
    .select("*")
    .order("scheduled_date", { ascending: true });

  if (error) {
    console.error("Error al obtener la orden de servicios:", error);
    return null;
  }

  return services; // array de servicios
};
