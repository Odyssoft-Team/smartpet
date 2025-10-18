// src/hooks/useCards.ts
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { Cards } from "../utils/Card";

export function useCards() {
  const [cards, setCards] = useState<Cards[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener tarjetas del usuario
  const getCards = async (): Promise<Cards[] | null> => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setCards(data || []);
      return data;
    } catch (error) {
      console.error("Error obteniendo las cards:", error);
      toast.error("No se pudieron cargar las tarjetas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear tarjeta
  const addCard = async (
    newCard: Omit<Cards, "id" | "created_at" | "update_at">
  ): Promise<Cards | null> => {
    try {
      setLoading(true);

      // Obtener el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      // Insertar con user_id
      const { data, error } = await supabase
        .from("cards")
        .insert([{ ...newCard, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => [...prev, data]);
      toast.success("Tarjeta añadida correctamente");
      return data;
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
      toast.error("No se pudo agregar la tarjeta");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar tarjeta
  const updateCard = async (id: string, updates: Partial<Cards>) => {
    const { data, error } = await supabase
      .from("cards")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando tarjeta:", error);
      throw error;
    }

    return data;
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) throw error;

      toast.success("Tarjeta eliminada correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar la tarjeta:", error);
      toast.error("No se pudo eliminar la tarjeta");
      return false;
    }
  };

  return { cards, loading, getCards, addCard, updateCard, deleteCard };
}
