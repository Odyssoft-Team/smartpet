import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface Card {
  id: string;
  user_id: string;
  label: string;
  card_holder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  brand: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  // 💳 Obtener todas las tarjetas del usuario
  const getCards = async (): Promise<Card[] | null> => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) throw error;

      setCards(data || []);
      return data;
    } catch (error) {
      console.error("Error obteniendo tarjetas:", error);
      toast.error("No se pudieron cargar las tarjetas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ➕ Agregar nueva tarjeta
  const addCard = async (newCard: Omit<Card, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("cards")
        .insert([
          {
            user_id: user.id,
            label: newCard.label,
            card_holder_name: newCard.card_holder_name,
            card_number: newCard.card_number,
            expiry_month: newCard.expiry_month,
            expiry_year: newCard.expiry_year,
            brand: newCard.brand,
            is_default: newCard.is_default || false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => [...prev, data]);
      toast.success("Tarjeta agregada correctamente ✅");
      return data;
    } catch (error) {
      console.error("Error agregando tarjeta:", error);
      toast.error("No se pudo agregar la tarjeta");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar tarjeta
  const deleteCard = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCards((prev) => prev.filter((card) => card.id !== id));
      toast.success("Tarjeta eliminada correctamente ✅");
      return true;
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
      toast.error("No se pudo eliminar la tarjeta");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cards, loading, getCards, addCard, deleteCard };
}
