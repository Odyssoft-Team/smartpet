import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface Deworming {
  id: string;
  pet_id: string;
  applied_at: string;
  product_name?: string;
  next_dose_at?: string;
  notes?: string;
  created_at: string;
}

export function useDeworming() {
  const [loading, setLoading] = useState(false);

  const getDewormingsByPet = async (petId: string): Promise<Deworming[] | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("deworming")
        .select("*")
        .eq("pet_id", petId)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo desparasitaciones:", error);
      toast.error("No se pudieron cargar las desparasitaciones");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addDeworming = async (deworming: Omit<Deworming, "id" | "created_at">): Promise<Deworming | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("deworming")
        .insert([deworming])
        .select()
        .single();

      if (error) throw error;
      toast.success("Desparasitación registrada con éxito");
      return data;
    } catch (error) {
      console.error("Error registrando desparasitación:", error);
      toast.error("No se pudo registrar la desparasitación");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getDewormingsByPet,
    addDeworming,
  };
}