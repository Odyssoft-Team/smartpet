import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface Address {
  id: string;
  user_id: string;
  alias: string;
  address: string;
  reference?: string;
  district_id: number;
  is_default: boolean;
  created_at?: string;
}

interface District {
  id: number;
  name: string;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  // 📍 Obtener todas las direcciones del usuario
  const getAddresses = async (): Promise<Address[] | null> => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) throw error;

      setAddresses(data || []);
      return data;
    } catch (error) {
      console.error("Error obteniendo direcciones:", error);
      toast.error("No se pudieron cargar las direcciones");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 📍 Obtener distritos
  const getDistricts = async (): Promise<District[] | null> => {
    try {
      const { data, error } = await supabase
        .from("district_catalog")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error obteniendo distritos:", error);
      return null;
    }
  };

  // ➕ Agregar nueva dirección
  const addAddress = async (newAddress: Omit<Address, "id" | "user_id" | "created_at">) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("user_addresses")
        .insert([
          {
            user_id: user.id,
            alias: newAddress.alias,
            address: newAddress.address,
            reference: newAddress.reference || null,
            district_id: newAddress.district_id,
            is_default: newAddress.is_default || false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setAddresses((prev) => [...prev, data]);
      toast.success("Dirección agregada correctamente ✅");
      return data;
    } catch (error) {
      console.error("Error agregando dirección:", error);
      toast.error("No se pudo agregar la dirección");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Actualizar dirección
  const updateAddress = async (id: string, updatedData: Partial<Address>) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_addresses")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? { ...addr, ...data } : addr))
      );

      toast.success("Dirección actualizada correctamente ✅");
      return data;
    } catch (error) {
      console.error("Error actualizando dirección:", error);
      toast.error("No se pudo actualizar la dirección");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar dirección
  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success("Dirección eliminada correctamente ✅");
      return true;
    } catch (error) {
      console.error("Error eliminando dirección:", error);
      toast.error("No se pudo eliminar la dirección");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addresses, loading, getAddresses, getDistricts, addAddress, updateAddress, deleteAddress };
}
