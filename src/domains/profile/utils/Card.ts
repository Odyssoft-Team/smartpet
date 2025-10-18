type Cards = {
  user_id?: string;
  id: string;
  is_default: boolean;
  label: string;
  card_holder_name: string;
  card_number?: string;
  expiry_month?: number;
  expiry_year?: number;
  brand: "unknown" | "visa" | "mastercard" | "amex" | "discover";
  created_at?: string;
  update_at?: string;
};

export type { Cards };
