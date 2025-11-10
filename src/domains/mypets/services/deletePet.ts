import { supabase } from "@/lib/supabaseClient";

export const deletePet = async (petId: number): Promise<boolean> => {
  try {
    const { error } = await supabase.from("pets").delete().eq("id", petId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error eliminando mascota:", error);
    return false;
  }
};
