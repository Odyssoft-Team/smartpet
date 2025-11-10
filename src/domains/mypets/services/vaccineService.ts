import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface Vaccine {
  id: string;
  pet_id: string;
  applied_at: string;
  next_dose_at?: string;
  notes?: string;
  vaccine_catalog_id?: number;
  created_at: string;
}

export function useVaccines() {
  const [loading, setLoading] = useState(false);

  const getVaccines = async (petId: string): Promise<Vaccine[] | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vaccines")
        .select("*")
        .eq("pet_id", petId)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo vacunas:", error);
      toast.error("No se pudieron cargar las vacunas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addVaccine = async (vaccine: Omit<Vaccine, "id" | "created_at">): Promise<Vaccine | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vaccines")
        .insert([vaccine])
        .select()
        .single();

      if (error) throw error;
      toast.success("Vacuna registrada con éxito");
      return data;
    } catch (error) {
      console.error("Error registrando vacuna:", error);
      toast.error("No se pudo registrar la vacuna");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getVaccines,
    addVaccine,
  };
}