import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";
import type { Card } from "../services/cardService";
import CardDisplay from "../components/CardDisplay";

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
              <CardDisplay
                key={card.id}
                card={card}
                onDelete={handleDelete}
                showDeleteButton={true}
              />
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
