import { supabase } from "../../../lib/supabaseClient";
import { toast } from "sonner";
import { useState } from "react";

export function useServices() {
  const [loading, setLoading] = useState(false);

  const getServices = async () => {
    setLoading(true);

    const { data: services, error } = await supabase
      .from("services")
      .select("*");

    setLoading(false);

    if (error) {
      console.error("Error fetching services:", error);
      toast.error("Error al obtener los servicios");
      return null;
    }

    return services; // array de servicios
  };

  return { getServices, loading };
}
