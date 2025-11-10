type Pet = {
  id: number;
  user_id: string;
  name: string;
  weight?: number | null;
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

export type { Pet };
