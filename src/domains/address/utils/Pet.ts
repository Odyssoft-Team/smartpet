type Pet = {
  id: string;
  user_id: string;
  name: string;
  weight: string;
  species: "Perro" | "Gato" | "Otro";
  breed: string;
  photo_url?: string | null;
  birth_date?: string | null;
};

export type { Pet };
