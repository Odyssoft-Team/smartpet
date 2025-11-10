import { supabase } from "@/lib/supabaseClient";

export type Pet = {
  id: number;
  user_id: string;
  name: string;
  weight?: number | null | string;
  species?: string;
  breed?: string;
  photo_url?: string | null;
  birth_date?: string | null;
  allergies?: string | null;
  special_condition?: string | null;
  social_behavior?: number | null;
  species_id?: number;
  breed_id?: number;
  created_at?: string;
  updated_at?: string;
};

export const getPetsByUser = async (): Promise<Pet[] | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error obteniendo las mascotas:", error);
    return null;
  }
};
