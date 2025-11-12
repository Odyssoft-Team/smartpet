import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";
import type { Card } from "../services/cardService";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) {
        console.error("Error obteniendo tarjetas:", error);
      } else {
        setCards(data || []);
      }
      setLoading(false);
    };

    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarjeta?")) {
      try {
        const { error } = await supabase.from("cards").delete().eq("id", id);

        if (error) {
          console.error("Error eliminando tarjeta:", error);
        } else {
          setCards((prev) => prev.filter((card) => card.id !== id));
        }
      } catch (error) {
        console.error("Error en handleDelete:", error);
      }
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/">
            <Button
              size="back"
              variant="back"
              className="w-auto h-auto py-2 text-icon hover:text-icon"
            >
              <IoIosArrowBack className="size-8" />
              <span>Medios de pago</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando tarjetas...
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-500">No tienes tarjetas registradas</p>
            <Link to="/cards/add">
              <Button className="bg-black text-white">Agregar tarjeta</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{card.label}</h3>
                      {card.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {card.card_holder_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {maskCardNumber(card.card_number)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Vence: {String(card.expiry_month).padStart(2, "0")}/
                      {card.expiry_year}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    className="flex-1"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            <Link to="/cards/add">
              <Button className="w-full bg-black text-white mt-4">
                Agregar nueva tarjeta
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
