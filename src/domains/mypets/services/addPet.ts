import { supabase } from "@/lib/supabaseClient";
import type { Pet } from "./getPetsByUser";
import { uploadPetPhoto } from "./uploadPetPhoto";

export const addPet = async (
  newPet: Omit<Pet, "id" | "user_id"> & { photoFile?: File }
) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No hay usuario autenticado");

    const formattedPet = {
      name: newPet.name,
      species_id: newPet.species_id,
      breed_id: newPet.breed_id,
      weight: newPet.weight ? parseFloat(newPet.weight.toString()) : null,
      birth_date: newPet.birth_date
        ? new Date(newPet.birth_date).toISOString().split("T")[0]
        : null,
      user_id: user.id,
      photo_url: newPet.photo_url || null,
      allergies: newPet.allergies || null,
      special_condition: newPet.special_condition || null,
      social_behavior: newPet.social_behavior || null,
    };

    if (newPet.photoFile) {
      const photoUrl = await uploadPetPhoto(newPet.photoFile, newPet.name);
      formattedPet.photo_url = photoUrl;
    }

    const { data, error } = await supabase
      .from("pets")
      .insert([formattedPet])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error agregando la mascota:", error);
    return null;
  }
};
