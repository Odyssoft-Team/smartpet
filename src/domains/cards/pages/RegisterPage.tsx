import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";
import CardForm from "../components/CardForm";
import { toast } from "sonner";
import { detectCardBrand } from "../utils/cardDetection";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCardSubmit = async (cardData: {
    label: string;
    card_holder_name: string;
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
  }) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Debes estar autenticado");
        return;
      }

      // Detectar marca de tarjeta
      const brand = detectCardBrand(cardData.card_number);
      const brandValue = brand === "unknown" ? "visa" : brand;

      const { error } = await supabase.from("cards").insert({
        user_id: user.id,
        label: cardData.label,
        card_holder_name: cardData.card_holder_name,
        card_number: cardData.card_number,
        expiry_month: cardData.expiry_month,
        expiry_year: cardData.expiry_year,
        brand: brandValue,
        is_default: cardData.is_default,
      });

      if (error) {
        console.error("Error Supabase:", error);
        toast.error("No se pudo registrar la tarjeta");
        return;
      }

      toast.success("Tarjeta registrada correctamente ✅");
      navigate("/cards");
    } catch (error) {
      console.error("Error registrando tarjeta:", error);
      toast.error("Ocurrió un error al guardar la tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/cards">
            <Button
              size="back"
              variant="back"
              className="w-auto h-auto py-2 text-icon hover:text-icon"
            >
              <IoIosArrowBack className="size-8" />
              <span>Nueva tarjeta</span>
            </Button>
          </Link>
        </div>

        {/* Form */}
        <CardForm onSubmit={handleCardSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
