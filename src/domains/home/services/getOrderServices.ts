import { supabase } from "@/lib/supabaseClient";

export const getOrderServices = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No hay usuario autenticado");
    return null;
  }

  const { data: services, error } = await supabase
    .from("service_orders")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: true });

  if (error) {
    console.error("Error al obtener la orden de servicios:", error);
    return null;
  }

  return services; // array de servicios
};
