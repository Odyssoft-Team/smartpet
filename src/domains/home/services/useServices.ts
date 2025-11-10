import { supabase } from "../../../lib/supabaseClient";
import { toast } from "sonner";
import { useState } from "react";

export function useServices() {
  const [loading, setLoading] = useState(false);

  const getServices = async () => {
    setLoading(true);

    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: true });

    setLoading(false);

    if (error) {
      console.error("Error fetching services:", error);
      toast.error("Error al obtener los servicios");
      return null;
    }

    return services; // array de servicios
  };

  const getServiceVariants = async (serviceId: number) => {
    setLoading(true);

    const { data: serviceVariants, error } = await supabase
      .from("service_variants")
      .select("*")
      .eq("service_id", serviceId)
      .order("id", { ascending: true });

    setLoading(false);

    if (error) {
      console.error("Error fetching variants:", error.message);
      return [];
    }

    return serviceVariants;
  };

  return { getServices, getServiceVariants, loading };
}
