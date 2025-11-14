import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface Revision {
  id: string;
  pet_id: string;
  clinic_id?: string;
  description?: string;
  created_at: string;
  revision_type_id?: number;
  revision_status_id?: number;
  clinic?: {
    name: string;
    address?: string;
    phone?: string;
  };
  revision_type?: {
    name: string;
  };
  revision_status?: {
    name: string;
  };
}

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface RevisionType {
  id: number;
  name: string;
}

export interface RevisionStatus {
  id: number;
  name: string;
}

export function useRevisions() {
  const [loading, setLoading] = useState(false);

  const getRevisionsByPet = async (petId: string): Promise<Revision[] | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("revisions")
        .select(`
          *,
          clinic:clinics(name, address, phone),
          revision_type:revision_type_catalog(name),
          revision_status:revision_status_catalog(name)
        `)
        .eq("pet_id", petId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo revisiones:", error);
      toast.error("No se pudieron cargar las revisiones");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getClinics = async (): Promise<Clinic[] | null> => {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo clínicas:", error);
      return null;
    }
  };

  const getRevisionTypes = async (): Promise<RevisionType[] | null> => {
    try {
      const { data, error } = await supabase
        .from("revision_type_catalog")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo tipos de revisión:", error);
      return null;
    }
  };

  const getRevisionStatuses = async (): Promise<RevisionStatus[] | null> => {
    try {
      const { data, error } = await supabase
        .from("revision_status_catalog")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error obteniendo estados de revisión:", error);
      return null;
    }
  };

  const addRevision = async (revision: Omit<Revision, "id" | "created_at">): Promise<Revision | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("revisions")
        .insert([revision])
        .select(`
          *,
          clinic:clinics(name, address, phone),
          revision_type:revision_type_catalog(name),
          revision_status:revision_status_catalog(name)
        `)
        .single();

      if (error) throw error;
      toast.success("Revisión registrada con éxito");
      return data;
    } catch (error) {
      console.error("Error registrando revisión:", error);
      toast.error("No se pudo registrar la revisión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getRevisionsByPet,
    getClinics,
    getRevisionTypes,
    getRevisionStatuses,
    addRevision,
  };
}