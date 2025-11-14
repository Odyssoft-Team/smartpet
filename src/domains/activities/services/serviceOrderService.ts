import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface ServiceOrderDetail {
  id: string;
  user_id: string;
  pet_id: number;
  scheduled_date: string;
  scheduled_time: string;
  total: number;
  payment_status: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useServiceOrder() {
  const [loading, setLoading] = useState(false);

  const getServiceOrderById = async (orderId: string): Promise<ServiceOrderDetail | null> => {
    try {
      setLoading(true);
      console.log("Buscando order ID:", orderId);
      
      const { data, error } = await supabase
        .from("service_orders")
        .select("*")
        .eq("id", orderId)
        .single();

      console.log("Respuesta de Supabase:", { data, error });

      if (error) {
        console.error("Error de Supabase:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error obteniendo orden de servicio:", error);
      toast.error("No se pudo cargar la información del servicio");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getServiceOrderById,
  };
}